import { Component } from '@angular/core';
import { Country } from '../countries/country.model';
import { Contact } from './contacts.model';
import { ContactsService } from 'src/app/core/services/contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})

// Contacts Component
export class ContactsComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  contacts: Contact[] = [];
  countries: Country[] = [];
  newContact: Contact = {};
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private contactsService: ContactsService) {}

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

  index(): void {
    this.contactsService.index(this.currentPage).subscribe((response: any) => {
      this.contacts = response.data;
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

  deleteContact(id: number | undefined): void {
    if (!id) return;
    this.contactsService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Contact deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        // console.error('Error deleting city', error);
        this.errorMessage =
          'Failed to delete city' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
