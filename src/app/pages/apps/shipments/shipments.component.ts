import { Component } from '@angular/core';
import { Country } from '../countries/country.model';
import { Shipment } from './shipment.model';
import { City } from '../cities/city.model';
import { ShipmentsService } from 'src/app/core/services/shipments.service';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrl: './shipments.component.scss',
})
export class ShipmentsComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  shipments: Shipment[] = [];
  countries: Country[] = [];
  cities: City[] = [];
  newShipment: Shipment = {};
  editShipmentData: Shipment = {};
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private shipmentsService: ShipmentsService) {}

  ngOnInit(): void {
    this.index();
    this.getAllCountries();
  }

  extractErrorMessage(error: any): string {
    let errorMessage = 'An error occurred';
    if (error && error.error && error.error.errors) {
      errorMessage = Object.values(error.error.errors).flat().join(', ');
    }
    return errorMessage;
  }

  getCitiesByCountry(countryId: any): void {
    if (countryId) {
      this.shipmentsService.getCitiesByCountry(countryId).subscribe((data) => {
        this.cities = Object.values(data)[0];
      });
    } else {
      this.cities = [];
    }
  }

  addShipment(): void {
    this.shipmentsService.store(this.newShipment).subscribe(
      () => {
        this.index();
        this.newShipment = {};
        this.cities = [];
        this.successMessage = 'Shipment added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to add shipment: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.shipmentsService.index(this.currentPage).subscribe((response: any) => {
      this.shipments = response.data;
      this.currentPage = response.meta?.current_page || 1;
      this.totalPages = response.meta?.last_page || 1;
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.index();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.index();
    }
  }

  getAllCountries() {
    this.shipmentsService.getAllCountries().subscribe((data) => {
      this.countries = Object.values(data)[0];
    });
  }

  deleteShipment(id: number | undefined): void {
    if (!id) return;
    this.shipmentsService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Shipment deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to delete shipment: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  openEditShipmentModal(shipment: Shipment): void {
    this.editShipmentData = { ...shipment };
    if (this.editShipmentData.country_id) {
      this.getCitiesByCountry(this.editShipmentData.country_id);
    }
  }

  editShipment(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid shipment ID';
      return;
    }
    this.shipmentsService.update({ id, ...this.editShipmentData }).subscribe(
      () => {
        this.index();
        this.editShipmentData = {};
        this.cities = [];
        this.successMessage = 'Shipment updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating shipment: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
