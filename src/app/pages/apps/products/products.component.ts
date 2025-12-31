import { Component, ViewChild } from '@angular/core';
import { ProductsService } from 'src/app/core/services/products.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  @ViewChild('productModal') productModal!: ModalDirective;
  @ViewChild('deleteModal') deleteModal!: ModalDirective;

  products: any[] = [];
  categories: any[] = [];
  currentPage = 1;
  totalPages = 1;

  isEditMode = false;
  productToDelete: number | null = null;

  mainImage: File | null = null;
  additionalImages: File[] = [];
  currentProductImage: string = '';
  currentProductFiles: any[] = [];
  activeTabIndex = 0;
  imageUrl = environment.imgUrl ;
  
  
  // Image preview & loading
  mainImagePreview: string | null = null;
  additionalImagesPreview: string[] = [];
  isUploading = false;

  form: any = {
    id: null,
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    price_before_discount: 0,
    discount: 0,
    price_after_discount: 0,
    category_id: ''
  };

  // Available languages to add (expandable)
  availableLangs = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' }
  ];

  // Selected languages shown in the form (default en + ar)
  selectedLangs: Array<{ code: string; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' }
  ];

  successMessage = '';
  errorMessage = '';

  constructor(
    private productsService: ProductsService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productsService.index(this.currentPage).subscribe({
      next: (res: any) => {
        this.products = res.data;
        this.totalPages = res.last_page || 1;
        this.currentPage = res.current_page || 1;
      },
      error: (err) => {
        console.error('Load products error:', err);
        if (err.status === 401) {
          this.errorMessage = this.translate.instant('PRODUCTS.SESSION_EXPIRED');
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 2000);
        } else {
          this.errorMessage = this.translate.instant('PRODUCTS.FAILED_TO_LOAD_PRODUCTS');
        }
      }
    });
  }

  loadCategories() {
    this.productsService.getAllCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data || res;
      },
      error: (err) => {
        console.error('Load categories error:', err);
        if (err.status === 401) {
          this.errorMessage = this.translate.instant('PRODUCTS.SESSION_EXPIRED');
        } else {
          this.errorMessage = this.translate.instant('PRODUCTS.FAILED_TO_LOAD_CATEGORIES');
        }
      }
    });
  }

  nextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this.loadProducts(); } }
  previousPage() { if (this.currentPage > 1) { this.currentPage--; this.loadProducts(); } }
  goToPage(page: number) { this.currentPage = page; this.loadProducts(); }

  onMainImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.mainImage = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.mainImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onAdditionalImagesChange(event: any) {
    const files: File[] = Array.from(event.target.files);
    this.additionalImages = files;
    this.additionalImagesPreview = [];
    
    // Create previews for all images
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.additionalImagesPreview.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  // handle img load error safely
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement | null;
 
  }

  removeMainImagePreview() {
    this.mainImage = null;
    this.mainImagePreview = null;
  }

  removeAdditionalImagePreview(index: number) {
    this.additionalImages.splice(index, 1);
    this.additionalImagesPreview.splice(index, 1);
  }

  get activeLang() {
    return this.selectedLangs[this.activeTabIndex];
  }

  get finalPrice(): number {
    const before = Number(this.form.price_before_discount) || 0;
    const disc = Number(this.form.discount) || 0;
    return before - disc;
  }

  calculateFinalPrice() {
    this.form.price_after_discount = this.finalPrice;
  }

  saveProduct() {
    // ensure at least one title for selected languages
    for (const lang of this.selectedLangs) {
      if (!this.form.title?.[lang.code]) {
        this.errorMessage = this.translate.instant('PRODUCTS.TITLE_REQUIRED');
        return;
      }
    }
    if (!this.form.category_id) {
      this.errorMessage = this.translate.instant('PRODUCTS.CATEGORY_REQUIRED');
      return;
    }
    if (!this.mainImage && !this.isEditMode) {
      this.errorMessage = this.translate.instant('PRODUCTS.MAIN_IMAGE_REQUIRED');
      return;
    }

    const fd = new FormData();

    // Translations (append dynamically for selected languages)
    for (const lang of this.selectedLangs) {
      const code = lang.code;
      fd.append(`title[${code}]`, this.form.title?.[code] || '');
      fd.append(`description[${code}]`, this.form.description?.[code] || '');
    }

    // Prices
    fd.append('price_before_discount', this.form.price_before_discount.toString());
    fd.append('discount', this.form.discount.toString());
    fd.append('price_after_discount', this.finalPrice.toString());
    fd.append('category_id', this.form.category_id);

    // Images
    if (this.mainImage) fd.append('image', this.mainImage);
    this.additionalImages.forEach(img => fd.append('files[]', img));

    // Start loading
    this.isUploading = true;
    this.errorMessage = '';

    // Edit mode?
    if (this.isEditMode) {
      fd.append('_method', 'PUT');
      this.productsService.update(this.form.id, fd).subscribe({
        next: () => this.afterSave(this.translate.instant('PRODUCTS.PRODUCT_UPDATED_SUCCESS')),
        error: (err) => {
          console.error('Update error', err);
          if (err.status === 401) {
            this.errorMessage = this.translate.instant('PRODUCTS.SESSION_EXPIRED');
            // setTimeout(() => window.location.href = '/auth/login', 2000);
          } else {
            this.errorMessage = err.error?.message || this.translate.instant('PRODUCTS.UPDATE_FAILED');
          }
          this.isUploading = false;
        }
      });
    } else {
      this.productsService.store(fd).subscribe({
        next: () => this.afterSave(this.translate.instant('PRODUCTS.PRODUCT_CREATED_SUCCESS')),
        error: (err) => {
          console.error('Create error', err);
          if (err.status === 401) {
            this.errorMessage = this.translate.instant('PRODUCTS.SESSION_EXPIRED');
            // setTimeout(() => window.location.href = '/auth/login', 2000);
          } else {
            this.errorMessage = err.error?.message || this.translate.instant('PRODUCTS.CREATE_FAILED');
          }
          this.isUploading = false;
        }
      });
    }
  }

  afterSave(msg: string) {
    this.isUploading = false;
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 4000);
    this.productModal.hide();
    this.loadProducts();
    this.resetForm();
  }

  openCreateModal() {
    this.resetForm();
    this.productModal.show();
  }

  openUpdateModal(product: any) {
    this.isEditMode = true;
    this.errorMessage = '';
    
    // Fetch full product details with translations
    this.productsService.show(product.id).subscribe({
      next: (res: any) => {
        const fullProduct = res.data || res;
        
        // Check if title is object (translations) or string
        let titleObj: any = {};
        let descObj: any = {};
        
        if (typeof fullProduct.title === 'object' && fullProduct.title !== null) {
          titleObj = { ...fullProduct.title };
        } else if (typeof fullProduct.title === 'string') {
          // If backend returns string, use it for all languages
          titleObj = { en: fullProduct.title, ar: fullProduct.title };
        }
        
        if (typeof fullProduct.description === 'object' && fullProduct.description !== null) {
          descObj = { ...fullProduct.description };
        } else if (typeof fullProduct.description === 'string') {
          descObj = { en: fullProduct.description, ar: fullProduct.description };
        }
        
        this.form = {
          id: fullProduct.id,
          title: titleObj,
          description: descObj,
          price_before_discount: fullProduct.price_before_discount,
          discount: fullProduct.discount || 0,
          price_after_discount: fullProduct.price_after_discount,
          category_id: fullProduct.category_id || fullProduct.category?.id
        };
        
        // Set selected languages from product title keys
        const titleKeys = Object.keys(titleObj);
        if (titleKeys.length > 0) {
          this.selectedLangs = titleKeys.map((c: string) => {
            const found = this.availableLangs.find(l => l.code === c);
            return found ? found : { code: c, label: c.toUpperCase() };
          });
        } else {
          // Default languages if no translations found
          this.selectedLangs = [
            { code: 'en', label: 'English' },
            { code: 'ar', label: 'العربية' }
          ];
        }
        
        // Ensure all selected languages have initialized values in form
        this.selectedLangs.forEach(lang => {
          if (!this.form.title[lang.code]) {
            this.form.title[lang.code] = '';
          }
          if (!this.form.description[lang.code]) {
            this.form.description[lang.code] = '';
          }
        });
        
        this.mainImage = null;
        this.additionalImages = [];
        this.mainImagePreview = null;
        this.additionalImagesPreview = [];
        this.currentProductImage = fullProduct.image || '';
        this.currentProductFiles = fullProduct.files || [];
        this.activeTabIndex = 0;
        this.productModal.show();
      },
      error: (err) => {
        console.error('Failed to load product details:', err);
        if (err.status === 401) {
          this.errorMessage = this.translate.instant('PRODUCTS.SESSION_EXPIRED');
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = this.translate.instant('PRODUCTS.FAILED_TO_LOAD_PRODUCT_DETAILS');
        }
      }
    });
  }

  confirmDelete(id: number) {
    this.productToDelete = id;
    this.deleteModal.show();
  }

  deleteConfirmed() {
    if (!this.productToDelete) return;
    this.productsService.delete(this.productToDelete).subscribe({
      next: () => {
        this.successMessage = this.translate.instant('PRODUCTS.PRODUCT_DELETED_SUCCESS');
        this.loadProducts();
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = this.translate.instant('PRODUCTS.SESSION_EXPIRED');
          // setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = this.translate.instant('PRODUCTS.DELETE_FAILED');
        }
      }
    });
    this.deleteModal.hide();
  }



  resetForm() {
    this.form = {
      id: null,
      title: { en: '', ar: '' },
      description: { en: '', ar: '' },
      price_before_discount: 0,
      discount: 0,
      price_after_discount: 0,
      category_id: ''
    };
    this.mainImage = null;
    this.additionalImages = [];
    this.mainImagePreview = null;
    this.additionalImagesPreview = [];
    this.currentProductImage = '';
    this.currentProductFiles = [];
    this.isEditMode = false;
    this.activeTabIndex = 0;
    this.isUploading = false;
    // reset to default languages
    this.selectedLangs = [
      { code: 'en', label: 'English' },
      { code: 'ar', label: 'العربية' }
    ];
  }

  // Add a language to the form. Accepts either an event or a language code string.
  onLangAdd(eventOrCode: any) {
    const code = typeof eventOrCode === 'string' ? eventOrCode : eventOrCode?.target?.value;
    if (!code) return;
    if (this.selectedLangs.find(l => l.code === code)) return;
    const info = this.availableLangs.find(l => l.code === code);
    if (info) this.selectedLangs.push(info);
    // ensure form objects have keys
    if (!this.form.title) this.form.title = {};
    if (!this.form.description) this.form.description = {};
    this.form.title[code] = this.form.title[code] || '';
    this.form.description[code] = this.form.description[code] || '';
    // reset select value (if event was passed)
    try { if (eventOrCode && eventOrCode.target) (eventOrCode.target as HTMLSelectElement).value = ''; } catch {}
  }

  // helper used in template to check if a language is already selected
  isLangSelected(code: string): boolean {
    return !!this.selectedLangs?.some(s => s.code === code);
  }

  removeLang(index: number) {
    if (this.selectedLangs.length <= 1) {
      this.errorMessage = this.translate.instant('PRODUCTS.KEEP_AT_LEAST_ONE_LANGUAGE');
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    const lang = this.selectedLangs[index];
    if (lang) {
      delete this.form.title[lang.code];
      delete this.form.description[lang.code];
      this.selectedLangs.splice(index, 1);
      // adjust active tab if needed
      if (this.activeTabIndex >= this.selectedLangs.length) {
        this.activeTabIndex = this.selectedLangs.length - 1;
      }
    }
  }

  switchTab(index: number) {
    this.activeTabIndex = index;
    // Ensure form values are initialized for the active language
    const lang = this.selectedLangs[index];
    if (lang) {
      if (!this.form.title[lang.code]) {
        this.form.title[lang.code] = '';
      }
      if (!this.form.description[lang.code]) {
        this.form.description[lang.code] = '';
      }
    }
  }
}