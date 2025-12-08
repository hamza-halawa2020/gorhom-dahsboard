import { Component, ViewChild } from '@angular/core';
import { ReviewsService } from 'src/app/core/services/reviews.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
  @ViewChild('reviewModal') reviewModal!: ModalDirective;
  @ViewChild('deleteModal') deleteModal!: ModalDirective;

  reviews: any[] = [];
  products: any[] = [];
  currentPage = 1;
  totalPages = 1;

  isEditMode = false;
  reviewToDelete: number | null = null;
  isUploading = false;

  form: any = {
    id: null,
    review: '',
    name: '',
    rate: 5,
    status: 'pending',
    product_id: ''
  };

  successMessage = '';
  errorMessage = '';

  // Status options
  statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Rating stars
  stars = [1, 2, 3, 4, 5];

  constructor(private reviewsService: ReviewsService) {}

  ngOnInit(): void {
    this.loadReviews();
    this.loadProducts();
  }

  loadReviews() {
    this.reviewsService.index(this.currentPage).subscribe({
      next: (res: any) => {
        this.reviews = res.data;
        this.totalPages = res.last_page || 1;
        this.currentPage = res.current_page || 1;
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = 'Failed to load reviews';
        }
      }
    });
  }

  loadProducts() {
    this.reviewsService.getAllProducts().subscribe({
      next: (res: any) => {
        this.products = res.data || res;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load products';
      }
    });
  }

  nextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this.loadReviews(); } }
  previousPage() { if (this.currentPage > 1) { this.currentPage--; this.loadReviews(); } }

  setRating(rate: number) {
    this.form.rate = rate;
  }

  saveReview() {
    if (!this.form.name) {
      this.errorMessage = 'Name is required';
      return;
    }
    if (!this.form.review) {
      this.errorMessage = 'Review text is required';
      return;
    }
    if (!this.form.product_id) {
      this.errorMessage = 'Please select a product';
      return;
    }
    if (!this.form.rate || this.form.rate < 1 || this.form.rate > 5) {
      this.errorMessage = 'Please select a rating (1-5)';
      return;
    }

    const data: any = {
      name: this.form.name,
      review: this.form.review,
      rate: this.form.rate,
      product_id: this.form.product_id
    };

    if (this.isEditMode) {
      data.status = this.form.status;
    }

    this.isUploading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      data._method = 'PUT';
      this.reviewsService.update(this.form.id, data).subscribe({
        next: () => this.afterSave('Review updated successfully'),
        error: (err) => {
          this.errorMessage = err.error?.message || 'Update failed';
          this.isUploading = false;
        }
      });
    } else {
      this.reviewsService.store(data).subscribe({
        next: () => this.afterSave('Review created successfully'),
        error: (err) => {
          this.errorMessage = err.error?.message || 'Create failed';
          this.isUploading = false;
        }
      });
    }
  }

  afterSave(msg: string) {
    this.isUploading = false;
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 4000);
    this.reviewModal.hide();
    this.loadReviews();
    this.resetForm();
  }

  openCreateModal() {
    this.resetForm();
    this.reviewModal.show();
  }

  openUpdateModal(review: any) {
    this.isEditMode = true;
    this.form = {
      id: review.id,
      name: review.name,
      review: review.review,
      rate: review.rate,
      status: review.status || 'pending',
      product_id: review.product_id || review.product?.id
    };
    this.reviewModal.show();
  }

  confirmDelete(id: number) {
    this.reviewToDelete = id;
    this.deleteModal.show();
  }

  deleteConfirmed() {
    if (!this.reviewToDelete) return;
    this.reviewsService.delete(this.reviewToDelete).subscribe({
      next: () => {
        this.successMessage = 'Review deleted';
        this.loadReviews();
      },
      error: (err) => {
        this.errorMessage = 'Delete failed';
      }
    });
    this.deleteModal.hide();
  }

  resetForm() {
    this.form = {
      id: null,
      review: '',
      name: '',
      rate: 5,
      status: 'pending',
      product_id: ''
    };
    this.isEditMode = false;
    this.isUploading = false;
  }

  getStarClass(star: number): string {
    return star <= this.form.rate ? 'ri-star-fill text-warning' : 'ri-star-line text-muted';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-warning';
    }
  }
}
