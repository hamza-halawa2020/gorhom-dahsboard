import { Component } from '@angular/core';
import { CountriesService } from 'src/app/core/services/countries.service';
import { Country } from './country.model';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss',
})
export class CountriesComponent {
  Countries: Country[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  newCountry: Country = {};
  editCountryData: Country = {};
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private countriesService: CountriesService) {}

  ngOnInit(): void {
    this.index();
  }

  extractErrorMessage(error: any): string {
    let errorMessage = 'An error occurred';
    if (error && error.error && error.error.errors) {
      errorMessage = Object.values(error.error.errors).flat().join(', ');
    }
    return errorMessage;
  }

  addCountry(): void {
    this.countriesService.store(this.newCountry).subscribe(
      () => {
        this.index();
        this.newCountry = {};
        this.successMessage = 'Country added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to add country: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.countriesService.index().subscribe((data) => {
      this.Countries = Object.values(data)[0];
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

  deleteCountry(id: number | undefined): void {
    if (!id) return;
    this.countriesService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Country deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to delete country: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  openEditCountryModal(country: Country): void {
    this.editCountryData = { ...country };
  }

  editCountry(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid country ID';
      return;
    }
    this.countriesService.update({ id, ...this.editCountryData }).subscribe(
      () => {
        this.index();
        this.editCountryData = {};
        this.successMessage = 'Country updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating country: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
