import { Component } from '@angular/core';
import { Faq } from './faq.model';
import { FaqsService } from 'src/app/core/services/faqs.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss',
})
export class FaqsComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  faqs: Faq[] = [];
  newFaq: Faq = {};
  editFaqData: Faq = {};
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private faqsService: FaqsService) {}

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

  addFaq(): void {
    if (!this.newFaq.question || !this.newFaq.answer) {
      this.errorMessage = 'Please provide both question and answer.';
      return;
    }

    this.faqsService.store(this.newFaq).subscribe(
      () => {
        this.successMessage = 'FAQ added successfully!';
        this.index();
        this.newFaq = {};
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to add FAQ: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.faqsService.index(this.currentPage).subscribe((response: any) => {
      this.faqs = response.data;
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

  deleteFaq(id: number | undefined): void {
    if (!id) return;
    this.faqsService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'FAQ deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to delete FAQ: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  openEditFaqModal(faq: Faq): void {
    this.editFaqData = { ...faq };
  }

  editFaq(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid FAQ ID';
      return;
    }

    if (!this.editFaqData.question || !this.editFaqData.answer) {
      this.errorMessage = 'Please provide both question and answer.';
      return;
    }

    this.faqsService.update({ id, ...this.editFaqData }).subscribe(
      () => {
        this.index();
        this.editFaqData = {};
        this.successMessage = 'FAQ updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to update FAQ: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
