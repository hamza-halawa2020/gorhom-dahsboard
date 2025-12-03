import { Component } from '@angular/core';
import { ProductReview } from './product-review.model';
import { Product } from '../products/product.model';
import { ProductReviewService } from 'src/app/core/services/product-review.service';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.scss'
})
export class ProductReviewComponent {


  totalPages: number = 0;
  currentPage: number = 1;
  products: Product[] = [];
  productReiviewes: ProductReview[] = [];
  addNewCouseReview: ProductReview = {};
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private ProductsReviewService: ProductReviewService) {}

  ngOnInit(): void {
    this.index();
    this.getAllCategories();
  }
  getAllCategories() {
    this.ProductsReviewService.getAllProducts().subscribe((data) => {
      this.products = Object.values(data)[0];
      // console.log(this.countries);
    });
  }
  extractErrorMessage(error: any): string {
    let errorMessage = 'An error occurred';
    if (error && error.error && error.error.errors) {
      errorMessage = Object.values(error.error.errors).flat().join(', ');
    }
    return errorMessage;
  }

  addProductReview() {
    this.ProductsReviewService.store(this.addNewCouseReview).subscribe(
      () => {
        this.index();
        this.addNewCouseReview = {};
        this.successMessage = 'Product added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error: any) => {
        // console.error('Failed to add Product', error);
        this.errorMessage =
          'Failed to add Product. ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.ProductsReviewService.index(this.currentPage).subscribe(
      (response: any) => {
        this.productReiviewes = response.data;
        // console.log(this.productReiviewes);
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.last_page;
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

  deleteProductReview(id: number | undefined): void {
    if (!id) return;
    this.ProductsReviewService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Product deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        // console.error('Error deleting Product', error);
        this.errorMessage =
          'Failed to delete Product' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  toggleStatus(Product: any): void {
    const updatedStatus = Product.status === 'active' ? 'inactive' : 'active';
    this.ProductsReviewService.update({
      id: Product.id,
      status: updatedStatus,
    }).subscribe(
      () => {
        Product.status = updatedStatus;
        this.successMessage = 'Product status updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        // console.error('Error updating Product status', error);
        this.errorMessage =
          'Error updating Product status: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
