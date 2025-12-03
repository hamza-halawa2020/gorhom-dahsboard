import { Component } from '@angular/core';
import { PaymentsService } from 'src/app/core/services/payments.service';
import { Payment } from './payment.model';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
})
export class PaymentsComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  payments: Payment[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private paymentsService: PaymentsService) {}

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
    this.paymentsService.index(this.currentPage).subscribe((response: any) => {
      this.payments = response.data;
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
}
