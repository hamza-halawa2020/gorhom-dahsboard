import { Component } from '@angular/core';
import { Order } from './order.model';
import { Country } from '../countries/country.model';
import { OrdersService } from 'src/app/core/services/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  orders: Order[] = [];
  countries: Country[] = [];
  newOrder: Order = {};
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private ordersService: OrdersService) {}

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
  addOrder(): void {
    this.ordersService.store(this.newOrder).subscribe(
      () => {
        this.index();
        this.newOrder = {};
        this.successMessage = 'Order added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        // console.error('Error adding vity', error);
        this.errorMessage =
          'Failed to add order' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.ordersService.index(this.currentPage).subscribe((response: any) => {
      this.orders = response.data;
      this.currentPage = response.meta.current_page;
      this.totalPages = response.meta.last_page;
    });
  }

  changeStatus(orderId: number | undefined, newStatus: string): void {
    if (!orderId) {
      this.errorMessage = 'Order ID is missing. Cannot update status.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    this.ordersService.updateStatus(orderId, newStatus).subscribe(
      () => {
        this.index();
        this.successMessage = 'Order status updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to update order status: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  exportPendingOrders(): void {
    this.ordersService.exportPendingOrders().subscribe(
      (response: Blob) => {
        const blobUrl = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'pending-orders.xlsx';
        link.click();
        window.URL.revokeObjectURL(blobUrl);
        this.successMessage = 'File Downloaded successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error exporting pending orders: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
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

  deleteOrder(id: number | undefined): void {
    if (!id) return;
    this.ordersService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Order deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        // console.error('Error deleting order', error);
        this.errorMessage =
          'Failed to delete order' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  editOrder(id: number | undefined): void {
    this.ordersService.update({ id, ...this.newOrder }).subscribe(
      () => {
        this.index();
        this.newOrder = {};
        this.successMessage = 'Order updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        // console.error('Error updating order', error);
        this.errorMessage =
          'Error updating order' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
