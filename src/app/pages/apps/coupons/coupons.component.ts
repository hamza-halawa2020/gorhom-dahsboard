import { Component, ViewChild } from '@angular/core';
import { CouponsService } from 'src/app/core/services/coupons.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent {
  @ViewChild('couponModal') couponModal!: ModalDirective;
  @ViewChild('deleteModal') deleteModal!: ModalDirective;

  coupons: any[] = [];
  currentPage = 1;
  totalPages = 1;

  isEditMode = false;
  couponToDelete: number | null = null;
  isUploading = false;

  form: any = {
    id: null,
    code: '',
    type: 'percentage',
    value: 0,
    max_discount: null,
    min_order_amount: null,
    is_automatic: false,
    automatic_type: null,
    usage_limit: null,
    usage_per_user: null,
    is_active: true,
    starts_at: '',
    expires_at: ''
  };

  successMessage = '';
  errorMessage = '';

  // Type options
  typeOptions = [
    { value: 'fixed', label: 'COUPONS.TYPE_FIXED' },
    { value: 'percentage', label: 'COUPONS.TYPE_PERCENTAGE' }
  ];

  // Automatic type options
  automaticTypeOptions = [
    { value: 'first_order', label: 'COUPONS.AUTO_TYPE_FIRST_ORDER' }
  ];

  constructor(
    private couponsService: CouponsService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons() {
    this.couponsService.index(this.currentPage).subscribe({
      next: (res: any) => {
        this.coupons = res.data;
        this.totalPages = res.last_page || 1;
        this.currentPage = res.current_page || 1;
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = this.translate.instant('COUPONS.SESSION_EXPIRED');
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = this.translate.instant('COUPONS.FAILED_TO_LOAD_COUPONS');
        }
      }
    });
  }

  nextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this.loadCoupons(); } }
  previousPage() { if (this.currentPage > 1) { this.currentPage--; this.loadCoupons(); } }

  saveCoupon() {
    if (!this.form.code) {
      this.errorMessage = this.translate.instant('COUPONS.CODE_REQUIRED');
      return;
    }
    if (!this.form.type) {
      this.errorMessage = this.translate.instant('COUPONS.TYPE_REQUIRED');
      return;
    }
    if (!this.form.value || this.form.value <= 0) {
      this.errorMessage = this.translate.instant('COUPONS.VALUE_GREATER_THAN_ZERO');
      return;
    }

    const data: any = {
      code: this.form.code,
      type: this.form.type,
      value: this.form.value,
      is_active: this.form.is_active
    };

    if (this.form.max_discount) data.max_discount = this.form.max_discount;
    if (this.form.min_order_amount) data.min_order_amount = this.form.min_order_amount;
    if (this.form.is_automatic) {
      data.is_automatic = true;
      data.automatic_type = this.form.automatic_type || 'first_order';
    }
    if (this.form.usage_limit) data.usage_limit = this.form.usage_limit;
    if (this.form.usage_per_user) data.usage_per_user = this.form.usage_per_user;
    if (this.form.starts_at) data.starts_at = this.form.starts_at;
    if (this.form.expires_at) data.expires_at = this.form.expires_at;

    this.isUploading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      data._method = 'PUT';
      this.couponsService.update(this.form.id, data).subscribe({
        next: () => this.afterSave(this.translate.instant('COUPONS.COUPON_UPDATED_SUCCESS')),
        error: (err) => {
          this.errorMessage = err.error?.message || this.translate.instant('COUPONS.UPDATE_FAILED');
          this.isUploading = false;
        }
      });
    } else {
      this.couponsService.store(data).subscribe({
        next: () => this.afterSave(this.translate.instant('COUPONS.COUPON_CREATED_SUCCESS')),
        error: (err) => {
          this.errorMessage = err.error?.message || this.translate.instant('COUPONS.CREATE_FAILED');
          this.isUploading = false;
        }
      });
    }
  }

  afterSave(msg: string) {
    this.isUploading = false;
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 4000);
    this.couponModal.hide();
    this.loadCoupons();
    this.resetForm();
  }

  openCreateModal() {
    this.resetForm();
    this.couponModal.show();
  }

  openUpdateModal(coupon: any) {
    this.isEditMode = true;
    this.form = {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      max_discount: coupon.max_discount,
      min_order_amount: coupon.min_order_amount,
      is_automatic: coupon.is_automatic || false,
      automatic_type: coupon.automatic_type,
      usage_limit: coupon.usage_limit,
      usage_per_user: coupon.usage_per_user,
      is_active: coupon.is_active,
      starts_at: coupon.starts_at ? new Date(coupon.starts_at).toISOString().split('T')[0] : '',
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : ''
    };
    this.couponModal.show();
  }

  confirmDelete(id: number) {
    this.couponToDelete = id;
    this.deleteModal.show();
  }

  deleteConfirmed() {
    if (!this.couponToDelete) return;
    this.couponsService.delete(this.couponToDelete).subscribe({
      next: () => {
        this.successMessage = this.translate.instant('COUPONS.COUPON_DELETED_SUCCESS');
        this.loadCoupons();
      },
      error: (err) => {
        this.errorMessage = this.translate.instant('COUPONS.DELETE_FAILED');
      }
    });
    this.deleteModal.hide();
  }

  resetForm() {
    this.form = {
      id: null,
      code: '',
      type: 'percentage',
      value: 0,
      max_discount: null,
      min_order_amount: null,
      is_automatic: false,
      automatic_type: null,
      usage_limit: null,
      usage_per_user: null,
      is_active: true,
      starts_at: '',
      expires_at: ''
    };
    this.isEditMode = false;
    this.isUploading = false;
  }

  getTypeBadgeClass(type: string): string {
    return type === 'fixed' ? 'bg-success' : 'bg-info';
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'bg-success' : 'bg-danger';
  }

  getTypeText(type: string): string {
    switch (type) {
      case 'fixed': return 'COUPONS.TYPE_FIXED';
      case 'percentage': return 'COUPONS.TYPE_PERCENTAGE';
      default: return type;
    }
  }

  isExpired(expiresAt: string): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }
}
