import { Component } from '@angular/core';
import { ClientsService } from 'src/app/core/services/clients.service';
import { Country } from '../countries/country.model';
import { Client } from './client.model';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  clients: Client[] = [];
  countries: Country[] = [];
  newClient: Client = {};
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private clientsService: ClientsService) {}

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
  addClient(): void {
    this.clientsService.store(this.newClient).subscribe(
      () => {
        this.index();
        this.newClient = {};
        this.successMessage = 'Client added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        // console.error('Error adding vity', error);
        this.errorMessage =
          'Failed to add client' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.clientsService.index(this.currentPage).subscribe((response: any) => {
      this.clients = response.data;
      this.currentPage = response.meta.current_page;
      this.totalPages = response.meta.last_page;
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

  getAllCountries() {}

  deleteClient(id: number | undefined): void {
    if (!id) return;
    this.clientsService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Client deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        // console.error('Error deleting client', error);
        this.errorMessage =
          'Failed to delete client' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  editClient(id: number | undefined): void {
    this.clientsService.update({ id, ...this.newClient }).subscribe(
      () => {
        this.index();
        this.newClient = {};
        this.successMessage = 'Client updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        // console.error('Error updating client', error);
        this.errorMessage =
          'Error updating client' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
