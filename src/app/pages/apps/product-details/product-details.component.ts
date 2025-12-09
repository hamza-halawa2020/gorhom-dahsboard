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

  imageUrl = environment.imgUrl;
  successMessage = '';
  errorMessage = '';

  get mainImageUrl(): string {
    return this.productDetails?.image ? environment.imgUrl + this.productDetails.image : '';
  }

  getStars(rate: number) {
  return Array(rate).fill(0);
}

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) { }

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
  }

  addImages() {
    if (this.imageFiles.length === 0) return;

    const formData = new FormData();
    this.imageFiles.forEach(file => {
      formData.append('files[]', file);
    });


  }

  openImageModal(url: string) {
    this.previewImageUrl = url;
    this.imagePreviewModal.show();
  }



  confirmDeleteImage() {

  }
}