import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/core/services/products.service';
import { environment } from 'src/environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  @ViewChild('createproductModal') createproductModal!: ModalDirective;
  @ViewChild('imagePreviewModal') imagePreviewModal!: ModalDirective;
  @ViewChild('deleteImageModal') deleteImageModal!: ModalDirective;

  productDetails: any = null;
  additionalImages: any[] = [];
  imageFiles: File[] = [];
  id: number = 0;
  currentLang = 'en';
  previewImageUrl = '';
  imageToDelete: number | null = null;

  imageUrl = environment.imgUrl ;
  successMessage = '';
  errorMessage = '';

  get mainImageUrl(): string {
    return this.productDetails?.image ? environment.imgUrl  + this.productDetails.image : '';
  }

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.loadProduct();
    });
  }

  loadProduct() {
    this.productService.show(this.id).subscribe({
      next: (res: any) => {
        this.productDetails = res.data || res;
        this.additionalImages = this.productDetails.files || [];
      },
      error: (err) => {
        console.error('Failed to load product:', err);
        if (err.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else if (err.status === 404) {
          this.errorMessage = 'Product not found';
        } else {
          this.errorMessage = 'Failed to load product: ' + (err.error?.message || err.message);
        }
      }
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      // this.imageFiles = Array.from(files).filter((file: any) => {
      //   if (file.size > 2 * 1024 * 1024) {
      //     this.errorMessage = `${file.name} is larger than 2MB`;
      //     return false;
      //   }
      //   return true;
      // });
    }
  }

  addImages() {
    if (this.imageFiles.length === 0) return;

    const formData = new FormData();
    this.imageFiles.forEach(file => {
      formData.append('files[]', file);
    });

    // this.productService.addProductImages(this.id, formData).subscribe({
    //   next: (res: any) => {
    //     this.successMessage = 'Images added successfully!';
    //     this.additionalImages = [...this.additionalImages, ...(res.data.files || res.data)];
    //     this.imageFiles = [];
    //     setTimeout(() => this.successMessage = '', 4000);
    //   },
    //   error: (err) => {
    //     this.errorMessage = err.error?.message || 'Failed to upload images';
    //     setTimeout(() => this.errorMessage = '', 5000);
    //   }
    // });
  }

  openImageModal(url: string) {
    this.previewImageUrl = url;
    this.imagePreviewModal.show();
  }

  // confirmDeleteImage(id?: number) {
  //   this.imageToDelete = id || null;
  //   this.deleteImageModal.show();
  // }

  confirmDeleteImage() {
    // if (!this.imageToDelete) return;

    // this.productService.deleteProductImage(this.id, this.imageToDelete).subscribe({
    //   next: () => {
    //     this.additionalImages = this.additionalImages.filter(img => img.id !== this.imageToDelete);
    //     this.successMessage = 'Image deleted successfully';
    //     this.deleteImageModal.hide();
    //     this.imageToDelete = null;
    //   },
    //   error: () => {
    //     this.errorMessage = 'Failed to delete image';
    //   }
    // });
  }
}