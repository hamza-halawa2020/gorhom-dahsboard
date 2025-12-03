import { Component } from '@angular/core';
import { CouponsService } from 'src/app/core/services/coupons.service';
import { Coupon } from './coupon.model';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss',
})
export class CouponsComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  coupons: Coupon[] = [];
  addNewCoupon: Coupon = {};
  editCouponData: Coupon = {};
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private couponsService: CouponsService) {}

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

  addCoupon() {
    this.couponsService.store(this.addNewCoupon).subscribe(
      () => {
        this.index();
        this.addNewCoupon = {};
        this.successMessage = 'Coupon added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error: any) => {
        this.errorMessage =
          'Failed to add coupon. ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.couponsService.index(this.currentPage).subscribe((response: any) => {
      this.coupons = response.data;
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

  deleteCoupon(id: number | undefined): void {
    if (!id) return;
    this.couponsService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Coupon deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to delete coupon' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }


openEditCouponModal(coupon: Coupon): void {
  this.editCouponData = {
    ...coupon,
    start_date: coupon.start_date ? new Date(coupon.start_date).toISOString().split('T')[0] : '',
    end_date: coupon.end_date ? new Date(coupon.end_date).toISOString().split('T')[0] : ''
  };
}
  editCoupon(id: number | undefined): void {
    if (!id) return;
    this.couponsService.update({ id, ...this.editCouponData }).subscribe(
      () => {
        this.index();
        this.editCouponData = {};
        this.successMessage = 'Coupon updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating Coupon: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  toggleStatus(coupon: any): void {
    const updatedStatus = !coupon.is_active;
    this.couponsService
      .update({ id: coupon.id, is_active: updatedStatus })
      .subscribe(
        () => {
          coupon.is_active = updatedStatus;
          this.successMessage = 'Coupon status updated successfully!';
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        (error) => {
          this.errorMessage =
            'Error updating coupon status: ' + this.extractErrorMessage(error);
          setTimeout(() => (this.errorMessage = ''), 3000);
        }
      );
  }
}
