import { Component, ViewChild } from '@angular/core';
import { ShipmentsService } from 'src/app/core/services/shipments.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.scss']
})
export class ShipmentsComponent {
  @ViewChild('shipmentModal') shipmentModal!: ModalDirective;
  @ViewChild('deleteModal') deleteModal!: ModalDirective;

  shipments: any[] = [];
  countries: any[] = [];
  cities: any[] = [];
  currentPage = 1;
  totalPages = 1;

  isEditMode = false;
  shipmentToDelete: number | null = null;
  isUploading = false;

  form: any = {
    id: null,
    country_id: '',
    city_id: '',
    cost: 0
  };

  successMessage = '';
  errorMessage = '';

  constructor(private shipmentsService: ShipmentsService) {}

  ngOnInit(): void {
    this.loadShipments();
    this.loadCountries();
  }

  loadShipments() {
    this.shipmentsService.index(this.currentPage).subscribe({
      next: (res: any) => {
        this.shipments = res.data;
        this.totalPages = res.last_page || 1;
        this.currentPage = res.current_page || 1;
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = 'Failed to load shipments';
        }
      }
    });
  }

  loadCountries() {
    this.shipmentsService.getAllCountries().subscribe({
      next: (res: any) => {
        this.countries = res.data || res;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load countries';
      }
    });
  }

  onCountryChange() {
    if (this.form.country_id) {
      this.shipmentsService.getCitiesByCountry(this.form.country_id).subscribe({
        next: (res: any) => {
          this.cities = res.data || res;
          this.form.city_id = ''; // Reset city selection
        },
        error: (err) => {
          this.errorMessage = 'Failed to load cities';
          this.cities = [];
        }
      });
    } else {
      this.cities = [];
      this.form.city_id = '';
    }
  }

  nextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this.loadShipments(); } }
  previousPage() { if (this.currentPage > 1) { this.currentPage--; this.loadShipments(); } }

  saveShipment() {
    if (!this.form.country_id) {
      this.errorMessage = 'Please select a country';
      return;
    }
    if (!this.form.city_id) {
      this.errorMessage = 'Please select a city';
      return;
    }
    if (!this.form.cost || this.form.cost <= 0) {
      this.errorMessage = 'Please enter a valid cost';
      return;
    }

    const data: any = {
      country_id: this.form.country_id,
      city_id: this.form.city_id,
      cost: this.form.cost
    };

    this.isUploading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      data._method = 'PUT';
      this.shipmentsService.update(this.form.id, data).subscribe({
        next: () => this.afterSave('Shipment updated successfully'),
        error: (err) => {
          this.errorMessage = err.error?.message || 'Update failed';
          this.isUploading = false;
        }
      });
    } else {
      this.shipmentsService.store(data).subscribe({
        next: () => this.afterSave('Shipment created successfully'),
        error: (err) => {
          this.errorMessage = err.error?.message || 'Create failed';
          this.isUploading = false;
        }
      });
    }
  }

  afterSave(msg: string) {
    this.isUploading = false;
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 4000);
    this.shipmentModal.hide();
    this.loadShipments();
    this.resetForm();
  }

  openCreateModal() {
    this.resetForm();
    this.shipmentModal.show();
  }

  openUpdateModal(shipment: any) {
    this.isEditMode = true;
    this.form = { 
      id: shipment.id, 
      country_id: shipment.country_id || shipment.country?.id,
      city_id: shipment.city_id || shipment.city?.id,
      cost: shipment.cost
    };
    
    // Load cities for the selected country
    if (this.form.country_id) {
      this.shipmentsService.getCitiesByCountry(this.form.country_id).subscribe({
        next: (res: any) => {
          this.cities = res.data || res;
        }
      });
    }
    
    this.shipmentModal.show();
  }

  confirmDelete(id: number) {
    this.shipmentToDelete = id;
    this.deleteModal.show();
  }

  deleteConfirmed() {
    if (!this.shipmentToDelete) return;
    this.shipmentsService.delete(this.shipmentToDelete).subscribe({
      next: () => {
        this.successMessage = 'Shipment deleted';
        this.loadShipments();
      },
      error: (err) => {
        this.errorMessage = 'Delete failed';
      }
    });
    this.deleteModal.hide();
  }

  resetForm() {
    this.form = { id: null, country_id: '', city_id: '', cost: 0 };
    this.cities = [];
    this.isEditMode = false;
    this.isUploading = false;
  }
}
