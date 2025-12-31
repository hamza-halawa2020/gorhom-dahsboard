import { Component, ViewChild } from '@angular/core';
import { CountriesService } from 'src/app/core/services/countries.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent {
  @ViewChild('countryModal') countryModal!: ModalDirective;
  @ViewChild('deleteModal') deleteModal!: ModalDirective;

  countries: any[] = [];
  currentPage = 1;
  totalPages = 1;

  isEditMode = false;
  countryToDelete: number | null = null;
  activeTabIndex = 0;
  isUploading = false;

  form: any = {
    id: null,
    title: { en: '', ar: '' }
  };

  availableLangs = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' }
  ];

  selectedLangs: Array<{ code: string; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' }
  ];

  successMessage = '';
  errorMessage = '';

  constructor(private countriesService: CountriesService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries() {
    this.countriesService.index(this.currentPage).subscribe({
      next: (res: any) => {
        this.countries = res.data;
        this.totalPages = res.last_page || 1;
        this.currentPage = res.current_page || 1;
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = this.translate.instant('COUNTRIES.SESSION_EXPIRED');
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = this.translate.instant('COUNTRIES.FAILED_TO_LOAD_COUNTRIES');
        }
      }
    });
  }

  nextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this.loadCountries(); } }
  previousPage() { if (this.currentPage > 1) { this.currentPage--; this.loadCountries(); } }

  saveCountry() {
    for (const lang of this.selectedLangs) {
      if (!this.form.title?.[lang.code]) {
        this.errorMessage = this.translate.instant('COUNTRIES.TITLE_REQUIRED');
        return;
      }
    }

    const data: any = { title: {} };
    for (const lang of this.selectedLangs) {
      data.title[lang.code] = this.form.title[lang.code];
    }

    this.isUploading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      data._method = 'PUT';
      this.countriesService.update(this.form.id, data).subscribe({
        next: () => this.afterSave(this.translate.instant('COUNTRIES.COUNTRY_UPDATED_SUCCESS')),
        error: (err) => {
          this.errorMessage = err.error?.message || this.translate.instant('COUNTRIES.UPDATE_FAILED');
          this.isUploading = false;
        }
      });
    } else {
      this.countriesService.store(data).subscribe({
        next: () => this.afterSave(this.translate.instant('COUNTRIES.COUNTRY_CREATED_SUCCESS')),
        error: (err) => {
          this.errorMessage = err.error?.message || this.translate.instant('COUNTRIES.CREATE_FAILED');
          this.isUploading = false;
        }
      });
    }
  }

  afterSave(msg: string) {
    this.isUploading = false;
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 4000);
    this.countryModal.hide();
    this.loadCountries();
    this.resetForm();
  }

  openCreateModal() {
    this.resetForm();
    this.countryModal.show();
  }

  openUpdateModal(country: any) {
    this.isEditMode = true;
    this.errorMessage = '';
    
    // Fetch full country details with translations
    this.countriesService.show(country.id).subscribe({
      next: (res: any) => {
        const fullCountry = res.data || res;
        
        let titleObj: any = {};
        
        if (typeof fullCountry.title === 'object' && fullCountry.title !== null) {
          titleObj = { ...fullCountry.title };
        } else if (typeof fullCountry.title === 'string') {
          titleObj = { en: fullCountry.title, ar: fullCountry.title };
        }
        
        this.form = { id: fullCountry.id, title: titleObj };
        
        const titleKeys = Object.keys(titleObj);
        if (titleKeys.length > 0) {
          this.selectedLangs = titleKeys.map((c: string) => {
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
          if (!this.form.title[lang.code]) {
            this.form.title[lang.code] = '';
          }
        });
        
        this.activeTabIndex = 0;
        this.countryModal.show();
      },
      error: (err) => {
        console.error('Failed to load country details:', err);
        if (err.status === 401) {
          this.errorMessage = this.translate.instant('COUNTRIES.SESSION_EXPIRED');
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = this.translate.instant('COUNTRIES.FAILED_TO_LOAD_COUNTRY_DETAILS');
        }
      }
    });
  }

  confirmDelete(id: number) {
    this.countryToDelete = id;
    this.deleteModal.show();
  }

  deleteConfirmed() {
    if (!this.countryToDelete) return;
    this.countriesService.delete(this.countryToDelete).subscribe({
      next: () => {
        this.successMessage = this.translate.instant('COUNTRIES.COUNTRY_DELETED_SUCCESS');
        this.loadCountries();
      },
      error: (err) => {
        this.errorMessage = this.translate.instant('COUNTRIES.DELETE_FAILED');
      }
    });
    this.deleteModal.hide();
  }

  get activeLang() {
    return this.selectedLangs[this.activeTabIndex];
  }

  resetForm() {
    this.form = { id: null, title: { en: '', ar: '' } };
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
    if (!this.form.title) this.form.title = {};
    this.form.title[code] = this.form.title[code] || '';
    try { if (eventOrCode && eventOrCode.target) (eventOrCode.target as HTMLSelectElement).value = ''; } catch {}
  }

  isLangSelected(code: string): boolean {
    return !!this.selectedLangs?.some(s => s.code === code);
  }

  removeLang(index: number) {
    if (this.selectedLangs.length <= 1) {
      this.errorMessage = this.translate.instant('COUNTRIES.KEEP_AT_LEAST_ONE_LANGUAGE');
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    const lang = this.selectedLangs[index];
    if (lang) {
      delete this.form.title[lang.code];
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
      if (!this.form.title[lang.code]) {
        this.form.title[lang.code] = '';
      }
    }
  }
}
