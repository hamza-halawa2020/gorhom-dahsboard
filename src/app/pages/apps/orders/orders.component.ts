import { Component, ViewChild } from '@angular/core';
import { OrdersService } from 'src/app/core/services/orders.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  @ViewChild('orderDetailsModal') orderDetailsModal!: ModalDirective;
  @ViewChild('statusModal') statusModal!: ModalDirective;

  orders: any[] = [];
  currentPage = 1;
  totalPages = 1;

  selectedOrder: any = null;
  selectedOrderId: number | null = null;
  newStatus: string = '';

  successMessage = '';
  errorMessage = '';

  // Status options
  statusOptions = [
    { value: 'pending', label: 'Pending', class: 'bg-warning' },
    { value: 'completed', label: 'Completed', class: 'bg-success' },
    { value: 'cancelled', label: 'Cancelled', class: 'bg-danger' }
  ];

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.index(this.currentPage).subscribe({
      next: (res: any) => {
        this.orders = res.data;
        this.totalPages = res.last_page || 1;
        this.currentPage = res.current_page || 1;
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = 'Failed to load orders';
        }
      }
    });
  }

  nextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this.loadOrders(); } }
  previousPage() { if (this.currentPage > 1) { this.currentPage--; this.loadOrders(); } }

  viewOrderDetails(orderId: number) {
    this.ordersService.show(orderId).subscribe({
      next: (res: any) => {
        this.selectedOrder = res.data;
        this.orderDetailsModal.show();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load order details';
      }
    });
  }

  openStatusModal(order: any) {
    this.selectedOrderId = order.id;
    this.newStatus = order.status;
    this.statusModal.show();
  }

  updateStatus() {
    if (!this.selectedOrderId || !this.newStatus) return;

    this.ordersService.updateStatus(this.selectedOrderId, this.newStatus).subscribe({
      next: () => {
        this.successMessage = 'Order status updated successfully';
        setTimeout(() => this.successMessage = '', 4000);
        this.statusModal.hide();
        this.loadOrders();
      },
      error: (err) => {
        this.errorMessage = 'Failed to update status';
      }
    });
  }

  exportPendingOrders() {
    this.ordersService.exportPendingOrders().subscribe({
      next: (response: Blob) => {
        const blobUrl = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'pending-orders.xlsx';
        link.click();
        window.URL.revokeObjectURL(blobUrl);
        this.successMessage = 'File downloaded successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to export orders';
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const statusOption = this.statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.class : 'bg-secondary';
  }

  getPaymentMethodIcon(method: string): string {
    switch (method) {
      case 'cash_on_delivery': return 'ri-money-dollar-circle-line';
      case 'visa': return 'ri-bank-card-line';
      case 'vodafone_cash': return 'ri-smartphone-line';
      default: return 'ri-question-line';
    }
  }

  getPaymentMethodLabel(method: string): string {
    switch (method) {
      case 'cash_on_delivery': return 'Cash on Delivery';
      case 'visa': return 'Visa';
      case 'vodafone_cash': return 'Vodafone Cash';
      default: return method;
    }
  }
}
