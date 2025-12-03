import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/core/services/products.service';
import { environment } from 'src/environments/environment';
import { Product } from '../products/product.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
    productDetails: Product | null = null;
    id: any;
    image = environment.imgUrl + 'products/';
    imageFile: File[] = [];
    showAddImageForm = false;
    additionalImages: any;
  
    selectedImage: File | null = null;
    successMessage: string = '';
    errorMessage: string = '';
  
    constructor(
      private activateRoute: ActivatedRoute,
      private productService: ProductsService
    ) {}
  
    ngOnInit(): void {
      this.getproductDetails();
    }
  
    extractErrorMessage(error: any): string {
      let errorMessage = 'An error occurred';
      if (error && error.error && error.error.errors) {
        errorMessage = Object.values(error.error.errors).flat().join(', ');
      }
      return errorMessage;
    }
    getproductDetails(): void {
      this.activateRoute.params.subscribe((params) => {
        this.id = +params['id'];
        this.productService.show(this.id).subscribe((data) => {
          this.productDetails = Object.values(data)[0];
          this.additionalImages = this.productDetails?.productImages || [];
        });
      });
    }
  
    toggleAddImageForm(): void {
      this.showAddImageForm = !this.showAddImageForm;
    }
  
    onFileSelected(product: any): void {
      this.imageFile = Array.from(product.target.files) as File[];
      for (let file of this.imageFile) {
        if (file.size > 5 * 1024 * 1024) {
          this.errorMessage = 'File size exceeds 5 MB';
          setTimeout(() => (this.errorMessage = ''), 3000);
  
          return;
        }
      }
      // console.log(this.imageFile);
    }
  
    addImage(id: any): void {
      const formData = new FormData();
      for (let file of this.imageFile) {
        formData.append('image[]', file);
      }
      console.log(formData);
      this.productService.update(id, formData).subscribe(
        (response: any) => {
          this.successMessage = 'Images uploaded successfully!';
          setTimeout(() => (this.successMessage = ''), 3000);
          this.getproductDetails();
  
          this.additionalImages = [
            ...this.additionalImages,
            ...response.data.images,
          ];
          this.showAddImageForm = false;
        },
        (error: any) => {
          // console.error('Failed:', error);
          this.errorMessage =
            'Failed to upload images. Please try again.' +
            this.extractErrorMessage(error);
          setTimeout(() => (this.errorMessage = ''), 3000);
        }
      );
    }
  
    deleteImage(imageId: string): void {
      this.productService.deleteImage(this.id, imageId).subscribe(
        (response: any) => {
          this.successMessage = 'Image deleted successfully!';
          setTimeout(() => (this.errorMessage = ''), 3000);
  
          this.additionalImages = this.additionalImages.filter(
            (img: any) => img.id !== imageId
          );
        },
        (error: any) => {
          // console.error('Failed to delete image:', error);
          (this.errorMessage = 'Failed to delete the image. Please try again.'),
            'danger' + this.extractErrorMessage(error);
          setTimeout(() => (this.errorMessage = ''), 3000);
        }
      );
    }
  }
  

