import { Component, ViewChild } from '@angular/core';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  @ViewChild('categoryModal') categoryModal!: ModalDirective;
  @ViewChild('deleteModal') deleteModal!: ModalDirective;

  categories: any[] = [];
  currentPage = 1;
  totalPages = 1;
  imageUrl = environment.imgUrl ;

  isEditMode = false;
  categoryToDelete: number | null = null;

  imageFile: File | null = null;
  currentCategoryImage: string = '';
  activeTabIndex = 0;

  // Image preview & loading
  imagePreview: string | null = null;
  isUploading = false;

  form: any = {
    id: null,
    name: { en: '', ar: '' }
  };

  // Available languages
  availableLangs = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' }
  ];

  // Selected languages (default en + ar)
  selectedLangs: Array<{ code: string; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' }
  ];

  successMessage = '';
  errorMessage = '';

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoriesService.index(this.currentPage).subscribe({
      next: (res: any) => {
        console.log('Categories response:', res);
        this.categories = res.data;
        this.totalPages = res.last_page || 1;
        this.currentPage = res.current_page || 1;
      },
      error: (err) => {
        console.error('Load categories error:', err);
        if (err.status === 401) {
          this.errorMessage = 'CATEGORIES.SESSION_EXPIRED';
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = 'CATEGORIES.FAILED_TO_LOAD_CATEGORIES';
        }
      }
    });
  }

  nextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this.loadCategories(); } }
  previousPage() { if (this.currentPage > 1) { this.currentPage--; this.loadCategories(); } }
  goToPage(page: number) { this.currentPage = page; this.loadCategories(); }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement | null;
  }

  get activeLang() {
    return this.selectedLangs[this.activeTabIndex];
  }

  removeImagePreview() {
    this.imageFile = null;
    this.imagePreview = null;
  }

  saveCategory() {
    // Ensure at least one name for selected languages
    for (const lang of this.selectedLangs) {
      if (!this.form.name?.[lang.code]) {
        this.errorMessage = `CATEGORIES.NAME_REQUIRED`;
        return;
      }
    }
    if (!this.imageFile && !this.isEditMode) {
      this.errorMessage = 'CATEGORIES.IMAGE_REQUIRED';
      return;
    }

    const fd = new FormData();

    // Translations
    for (const lang of this.selectedLangs) {
      const code = lang.code;
      fd.append(`name[${code}]`, this.form.name?.[code] || '');
    }

    // Image
    if (this.imageFile) fd.append('image', this.imageFile);

    // Start loading
    this.isUploading = true;
    this.errorMessage = '';

    // Edit mode?
    if (this.isEditMode) {
      fd.append('_method', 'PUT');
      this.categoriesService.update(this.form.id, fd).subscribe({
        next: () => this.afterSave('CATEGORIES.CATEGORY_UPDATED_SUCCESS'),
        error: (err) => {
          console.error('Update error', err);
          if (err.status === 401) {
            this.errorMessage = 'CATEGORIES.SESSION_EXPIRED';
            setTimeout(() => window.location.href = '/auth/login', 2000);
          } else {
            this.errorMessage = err.error?.message || 'CATEGORIES.UPDATE_FAILED';
          }
          this.isUploading = false;
        }
      });
    } else {
      this.categoriesService.store(fd).subscribe({
        next: () => this.afterSave('CATEGORIES.CATEGORY_CREATED_SUCCESS'),
        error: (err) => {
          console.error('Create error', err);
          if (err.status === 401) {
            this.errorMessage = 'CATEGORIES.SESSION_EXPIRED';
            setTimeout(() => window.location.href = '/auth/login', 2000);
          } else {
            this.errorMessage = err.error?.message || 'CATEGORIES.CREATE_FAILED';
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
    this.categoryModal.hide();
    this.loadCategories();
    this.resetForm();
  }

  openCreateModal() {
    this.resetForm();
    this.categoryModal.show();
  }

  openUpdateModal(category: any) {
    this.isEditMode = true;
    this.errorMessage = '';
    
    // Fetch full category details with translations
    this.categoriesService.show(category.id).subscribe({
      next: (res: any) => {
        const fullCategory = res.data || res;
        
        // Check if name is object (translations) or string
        let nameObj: any = {};
        
        if (typeof fullCategory.name === 'object' && fullCategory.name !== null) {
          nameObj = { ...fullCategory.name };
        } else if (typeof fullCategory.name === 'string') {
          nameObj = { en: fullCategory.name, ar: fullCategory.name };
        }
        
        this.form = {
          id: fullCategory.id,
          name: nameObj
        };
        
        // Set selected languages from category name keys
        const nameKeys = Object.keys(nameObj);
        if (nameKeys.length > 0) {
          this.selectedLangs = nameKeys.map((c: string) => {
            const found = this.availableLangs.find(l => l.code === c);
            return found ? found : { code: c, label: c.toUpperCase() };
          });
        } else {
          this.selectedLangs = [
            { code: 'en', label: 'English' },
            { code: 'ar', label: 'العربية' }
          ];
        }
        
        // Ensure all selected languages have initialized values in form
        this.selectedLangs.forEach(lang => {
          if (!this.form.name[lang.code]) {
            this.form.name[lang.code] = '';
          }
        });
        
        this.imageFile = null;
        this.imagePreview = null;
        this.currentCategoryImage = fullCategory.image || '';
        this.activeTabIndex = 0;
        this.categoryModal.show();
      },
      error: (err) => {
        console.error('Failed to load category details:', err);
        if (err.status === 401) {
          this.errorMessage = 'CATEGORIES.SESSION_EXPIRED';
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = 'CATEGORIES.FAILED_TO_LOAD_CATEGORY_DETAILS';
        }
      }
    });
  }

  confirmDelete(id: number) {
    this.categoryToDelete = id;
    this.deleteModal.show();
  }

  deleteConfirmed() {
    if (!this.categoryToDelete) return;
    this.categoriesService.delete(this.categoryToDelete).subscribe({
      next: () => {
        this.successMessage = 'CATEGORIES.CATEGORY_DELETED_SUCCESS';
        this.loadCategories();
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'CATEGORIES.SESSION_EXPIRED';
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = 'CATEGORIES.DELETE_FAILED';
        }
      }
    });
    this.deleteModal.hide();
  }

  resetForm() {
    this.form = {
      id: null,
      name: { en: '', ar: '' }
    };
    this.imageFile = null;
    this.imagePreview = null;
    this.currentCategoryImage = '';
    this.isEditMode = false;
    this.activeTabIndex = 0;
    this.isUploading = false;
    this.selectedLangs = [
      { code: 'en', label: 'English' },
      { code: 'ar', label: 'العربية' }
    ];
  }

  onLangAdd(eventOrCode: any) {
    const code = typeof eventOrCode === 'string' ? eventOrCode : eventOrCode?.target?.value;
    if (!code) return;
    if (this.selectedLangs.find(l => l.code === code)) return;
    const info = this.availableLangs.find(l => l.code === code);
    if (info) this.selectedLangs.push(info);
    if (!this.form.name) this.form.name = {};
    this.form.name[code] = this.form.name[code] || '';
    try { if (eventOrCode && eventOrCode.target) (eventOrCode.target as HTMLSelectElement).value = ''; } catch { }
  }

  isLangSelected(code: string): boolean {
    return !!this.selectedLangs?.some(s => s.code === code);
  }

  removeLang(index: number) {
    if (this.selectedLangs.length <= 1) {
      this.errorMessage = 'CATEGORIES.KEEP_AT_LEAST_ONE_LANGUAGE';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    const lang = this.selectedLangs[index];
    if (lang) {
      delete this.form.name[lang.code];
      this.selectedLangs.splice(index, 1);
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
      if (!this.form.name[lang.code]) {
        this.form.name[lang.code] = '';
      }
    }
  }
}
