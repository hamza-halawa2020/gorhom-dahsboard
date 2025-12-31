import { Component, ViewChild } from '@angular/core';
import { OrdersService } from 'src/app/core/services/orders.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';

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
    { value: 'pending', label: 'ORDERS.STATUS_PENDING', class: 'bg-warning' },
    { value: 'completed', label: 'ORDERS.STATUS_COMPLETED', class: 'bg-success' },
    { value: 'cancelled', label: 'ORDERS.STATUS_CANCELLED', class: 'bg-danger' }
  ];

  constructor(
    private ordersService: OrdersService,
    private translate: TranslateService
  ) {}

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
          this.errorMessage = this.translate.instant('ORDERS.SESSION_EXPIRED');
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = this.translate.instant('ORDERS.FAILED_TO_LOAD_ORDERS');
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
        this.errorMessage = this.translate.instant('ORDERS.FAILED_TO_LOAD_ORDER_DETAILS');
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
        this.successMessage = this.translate.instant('ORDERS.ORDER_STATUS_UPDATED');
        setTimeout(() => this.successMessage = '', 4000);
        this.statusModal.hide();
        this.loadOrders();
      },
      error: (err) => {
        this.errorMessage = this.translate.instant('ORDERS.FAILED_TO_UPDATE_STATUS');
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
        this.successMessage = this.translate.instant('ORDERS.FILE_DOWNLOADED_SUCCESSFULLY');
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = this.translate.instant('ORDERS.FAILED_TO_EXPORT_ORDERS');
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
      case 'cash_on_delivery': return 'ORDERS.PAYMENT_CASH_ON_DELIVERY';
      case 'visa': return 'ORDERS.PAYMENT_VISA';
      case 'vodafone_cash': return 'ORDERS.PAYMENT_VODAFONE_CASH';
      default: return method;
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'ORDERS.STATUS_PENDING';
      case 'completed': return 'ORDERS.STATUS_COMPLETED';
      case 'cancelled': return 'ORDERS.STATUS_CANCELLED';
      default: return status;
    }
  }
}
