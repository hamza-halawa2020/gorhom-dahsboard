import { Component } from '@angular/core';
import { City } from './city.model';
import { CitiesService } from 'src/app/core/services/cities.service';
import { Country } from '../countries/country.model';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss',
})
export class CitiesComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  cities: City[] = [];
  countries: Country[] = [];
  newCity: City = {};
  editCityData: City = {};
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private citiesService: CitiesService) {}

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

  addCity(): void {
    this.citiesService.store(this.newCity).subscribe(
      () => {
        this.index();
        this.newCity = {};
        this.successMessage = 'City added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to add city: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.citiesService.index(this.currentPage).subscribe((data: any) => {
      this.cities = data.data;
      this.currentPage = data.meta?.current_page || 1;
      this.totalPages = data.meta?.last_page || 1;
    });
  }

  getAllCountries() {
    this.citiesService.getAllCountries().subscribe((data) => {
      this.countries = Object.values(data)[0];
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

  deleteCity(id: number | undefined): void {
    if (!id) return;
    this.citiesService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'City deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to delete city: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  openEditCityModal(city: City): void {
    this.editCityData = { ...city };
  }

  editCity(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid city ID';
      return;
    }
    this.citiesService.update({ id, ...this.editCityData }).subscribe(
      () => {
        this.index();
        this.editCityData = {};
        this.successMessage = 'City updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating city: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
