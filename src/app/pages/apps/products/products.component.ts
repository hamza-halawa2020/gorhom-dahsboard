import { Component, ViewChild } from '@angular/core';
import { Product } from './product.model';
import { environment } from 'src/environments/environment';
import { ProductsService } from 'src/app/core/services/products.service';
import { Router } from '@angular/router';
import { Category } from '../categories/category.model';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {

  @ViewChild('createProductModal') createProductModal!: ModalDirective;
  @ViewChild('updateProduct') updateProduct!: ModalDirective;
  totalPages: number = 0;
  currentPage: number = 1;
  products: Product[] = [];
  categories: Category[] = [];
  selectedFile: File[] | null = null;
  image = environment.imgUrl + 'products/';
  addNewProduct: Product = {};
  originalProduct: Product = {};
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private ProductsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.index();
    this.getAllCategories();
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFile = Array.from(files);
    } else {
      this.selectedFile = null;
    }
  }

  extractErrorMessage(error: any): string {
    let errorMessage = 'An error occurred';
    if (error && error.error && error.error.errors) {
      errorMessage = Object.values(error.error.errors).flat().join(', ');
    }
    return errorMessage;
  }

  getAllCategories() {
    this.ProductsService.getAllCategories().subscribe((data) => {
      this.categories = Object.values(data)[0];
    });
  }

  addProduct(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image to upload.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    const formData = new FormData();

    for (let file of this.selectedFile) {
      formData.append('image[]', file);
    }

    formData.append('title', this.addNewProduct.title || '');
    formData.append('description', this.addNewProduct.description || '');
    formData.append('stock', '1');

    const priceBeforeDiscount = parseFloat(this.addNewProduct.priceBeforeDiscount || '0') || 0;
    const discount = parseFloat(this.addNewProduct.discount || '0') || 0;
    const priceAfterDiscount = priceBeforeDiscount - discount;

    if (priceAfterDiscount < 0) {
      this.errorMessage = 'Price after discount cannot be negative';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    formData.append('priceBeforeDiscount', priceBeforeDiscount.toString());
    formData.append('discount', discount.toString());
    formData.append('priceAfterDiscount', priceAfterDiscount.toString());
    formData.append('category_id', this.addNewProduct.category_id || '');

    this.ProductsService.store(formData).subscribe(
      () => {
        this.index();
        this.addNewProduct = {};
        this.selectedFile = null;
        this.successMessage = 'Product added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
        this.createProductModal.hide(); // Close the modal
      },
      (error: any) => {
        this.errorMessage = 'Failed to add Product: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.ProductsService.index().subscribe((data) => {
      this.products = Object.values(data)[0];
      // this.totalPages = data.totalPages || 1; // Update totalPages if provided by API
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

  deleteProduct(id: number | undefined): void {
    if (!id) return;
    this.ProductsService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Product deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage = 'Failed to delete Product: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  openUpdateModal(product: Product): void {
    this.originalProduct = { ...product }; // Store original product data
    this.addNewProduct = {
      id: product.id,
      title: product.title || '',
      description: product.description || '',
      category_id: product.category_id || '',
      priceBeforeDiscount: product.priceBeforeDiscount || '0',
      discount: product.discount || '0',
      priceAfterDiscount: product.priceAfterDiscount || '0',
      stock: product.stock ||true, // Retain original stock value
    };
    this.selectedFile = null;
    this.updateProduct.show(); // Show the modal
  }

  get priceAfterDiscount(): number {
    const priceBeforeDiscount =
      this.addNewProduct.priceBeforeDiscount !== '' &&
      this.addNewProduct.priceBeforeDiscount !== undefined
        ? parseFloat(this.addNewProduct.priceBeforeDiscount)
        : parseFloat(this.originalProduct.priceBeforeDiscount || '0');

    const discount =
      this.addNewProduct.discount !== '' && this.addNewProduct.discount !== undefined
        ? parseFloat(this.addNewProduct.discount)
        : parseFloat(this.originalProduct.discount || '0');

    return priceBeforeDiscount - discount;
  }

  updatePriceAfterDiscount(): void {
    this.addNewProduct.priceAfterDiscount = this.priceAfterDiscount.toString();
  }

  editProduct(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid product ID';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    const formData = new FormData();

    if (this.selectedFile) {
      for (let file of this.selectedFile) {
        formData.append('image[]', file);
      }
    }

    if (this.addNewProduct.category_id) {
      formData.append('category_id', this.addNewProduct.category_id);
    }

    if (this.addNewProduct.title) {
      formData.append('title', this.addNewProduct.title);
    }

    if (this.addNewProduct.description) {
      formData.append('description', this.addNewProduct.description);
    }

    const priceBeforeDiscount =
      this.addNewProduct.priceBeforeDiscount !== '' &&
      this.addNewProduct.priceBeforeDiscount !== undefined
        ? parseFloat(this.addNewProduct.priceBeforeDiscount)
        : parseFloat(this.originalProduct.priceBeforeDiscount || '0');

    const discount =
      this.addNewProduct.discount !== '' && this.addNewProduct.discount !== undefined
        ? parseFloat(this.addNewProduct.discount)
        : parseFloat(this.originalProduct.discount || '0');

    const priceAfterDiscount = priceBeforeDiscount - discount;

    if (priceAfterDiscount < 0) {
      this.errorMessage = 'Price after discount cannot be negative';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    formData.append('priceBeforeDiscount', priceBeforeDiscount.toString());
    formData.append('discount', discount.toString());
    formData.append('priceAfterDiscount', priceAfterDiscount.toString());

    this.ProductsService.update(id, formData).subscribe(
      () => {
        this.index();
        this.addNewProduct = {};
        this.originalProduct = {};
        this.selectedFile = null;
        this.successMessage = 'Product updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
        this.updateProduct.hide(); // Close the modal
      },
      (error) => {
        this.errorMessage = 'Error updating Product: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  toggleStatus(product: any): void {
    const formData = new FormData();
    const updatedProduct = product.stock == '1' ? '0' : '1';
    formData.append('stock', updatedProduct);

    this.ProductsService.update(product.id, formData).subscribe(
      () => {
        product.stock = updatedProduct;
        this.successMessage = 'Product status updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage = 'Error updating Product status: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}