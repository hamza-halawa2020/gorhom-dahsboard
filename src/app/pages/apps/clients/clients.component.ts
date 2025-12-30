import { Component, ViewChild } from '@angular/core';
import { ClientsService } from 'src/app/core/services/clients.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
  @ViewChild('clientModal') clientModal!: ModalDirective;
  @ViewChild('deleteModal') deleteModal!: ModalDirective;
  @ViewChild('statsModal') statsModal!: ModalDirective;

  clients: any[] = [];
  currentPage = 1;
  totalPages = 1;

  isEditMode = false;
  clientToDelete: number | null = null;
  isUploading = false;

  // Search filters
  searchFilters = {
    phone: '',
    name: '',
    email: ''
  };

  // Client stats
  clientStats: any = null;

  form: any = {
    id: null,
    name: '',
    phone: '',
    email: ''
  };

  successMessage = '';
  errorMessage = '';

  constructor(private clientsService: ClientsService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    const filters = {
      phone: this.searchFilters.phone || undefined,
      name: this.searchFilters.name || undefined,
      email: this.searchFilters.email || undefined
    };

    this.clientsService.index(this.currentPage, filters).subscribe({
      next: (res: any) => {
        this.clients = res.data;
        this.totalPages = res.last_page || 1;
        this.currentPage = res.current_page || 1;
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'CLIENTS.SESSION_EXPIRED';
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = 'CLIENTS.FAILED_TO_LOAD_CLIENTS';
        }
      }
    });
  }

  search() {
    this.currentPage = 1;
    this.loadClients();
  }

  clearSearch() {
    this.searchFilters = { phone: '', name: '', email: '' };
    this.currentPage = 1;
    this.loadClients();
  }

  nextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this.loadClients(); } }
  previousPage() { if (this.currentPage > 1) { this.currentPage--; this.loadClients(); } }

  saveClient() {
    if (!this.form.name) {
      this.errorMessage = 'CLIENTS.NAME_REQUIRED';
      return;
    }
    if (!this.form.phone) {
      this.errorMessage = 'CLIENTS.PHONE_REQUIRED';
      return;
    }

    const data: any = {
      name: this.form.name,
      phone: this.form.phone
    };

    if (this.form.email) data.email = this.form.email;

    this.isUploading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      data._method = 'PUT';
      this.clientsService.update(this.form.id, data).subscribe({
        next: () => this.afterSave('CLIENTS.CLIENT_UPDATED_SUCCESS'),
        error: (err) => {
          this.errorMessage = err.error?.message || 'CLIENTS.UPDATE_FAILED';
          this.isUploading = false;
        }
      });
    } else {
      this.clientsService.store(data).subscribe({
        next: () => this.afterSave('CLIENTS.CLIENT_CREATED_SUCCESS'),
        error: (err) => {
          this.errorMessage = err.error?.message || 'CLIENTS.CREATE_FAILED';
          this.isUploading = false;
        }
      });
    }
  }

  afterSave(msg: string) {
    this.isUploading = false;
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 4000);
    this.clientModal.hide();
    this.loadClients();
    this.resetForm();
  }

  openCreateModal() {
    this.resetForm();
    this.clientModal.show();
  }

  openUpdateModal(client: any) {
    this.isEditMode = true;
    this.form = {
      id: client.id,
      name: client.name,
      phone: client.phone,
      email: client.email || ''
    };
    this.clientModal.show();
  }

  confirmDelete(id: number) {
    this.clientToDelete = id;
    this.deleteModal.show();
  }

  deleteConfirmed() {
    if (!this.clientToDelete) return;
    this.clientsService.delete(this.clientToDelete).subscribe({
      next: () => {
        this.successMessage = 'CLIENTS.CLIENT_DELETED_SUCCESS';
        this.loadClients();
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorMessage = 'CLIENTS.CANNOT_DELETE_CLIENT_WITH_ORDERS';
        } else {
          this.errorMessage = 'CLIENTS.DELETE_FAILED';
        }
      }
    });
    this.deleteModal.hide();
  }

  viewStats(clientId: number) {
    this.clientsService.getStats(clientId).subscribe({
      next: (res: any) => {
        this.clientStats = res.data;
        this.statsModal.show();
      },
      error: (err) => {
        this.errorMessage = 'CLIENTS.FAILED_TO_LOAD_STATISTICS';
      }
    });
  }

  resetForm() {
    this.form = {
      id: null,
      name: '',
      phone: '',
      email: ''
    };
    this.isEditMode = false;
    this.isUploading = false;
  }
}
