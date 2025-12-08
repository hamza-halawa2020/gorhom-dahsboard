import { Component, ViewChild } from '@angular/core';
import { CitiesService } from 'src/app/core/services/cities.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent {
  @ViewChild('cityModal') cityModal!: ModalDirective;
  @ViewChild('deleteModal') deleteModal!: ModalDirective;

  cities: any[] = [];
  countries: any[] = [];
  currentPage = 1;
  totalPages = 1;

  isEditMode = false;
  cityToDelete: number | null = null;
  activeTabIndex = 0;
  isUploading = false;

  form: any = {
    id: null,
    title: { en: '', ar: '' },
    country_id: ''
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

  constructor(private citiesService: CitiesService) {}

  ngOnInit(): void {
    this.loadCities();
    this.loadCountries();
  }

  loadCities() {
    this.citiesService.index(this.currentPage).subscribe({
      next: (res: any) => {
        this.cities = res.data;
        this.totalPages = res.last_page || 1;
        this.currentPage = res.current_page || 1;
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = 'Failed to load cities';
        }
      }
    });
  }

  loadCountries() {
    this.citiesService.getAllCountries().subscribe({
      next: (res: any) => {
        this.countries = res.data || res;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load countries';
      }
    });
  }

  nextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this.loadCities(); } }
  previousPage() { if (this.currentPage > 1) { this.currentPage--; this.loadCities(); } }

  saveCity() {
    for (const lang of this.selectedLangs) {
      if (!this.form.title?.[lang.code]) {
        this.errorMessage = `Title (${lang.label}) is required`;
        return;
      }
    }
    if (!this.form.country_id) {
      this.errorMessage = 'Please select a country';
      return;
    }

    const data: any = { title: {}, country_id: this.form.country_id };
    for (const lang of this.selectedLangs) {
      data.title[lang.code] = this.form.title[lang.code];
    }

    this.isUploading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      data._method = 'PUT';
      this.citiesService.update(this.form.id, data).subscribe({
        next: () => this.afterSave('City updated successfully'),
        error: (err) => {
          this.errorMessage = err.error?.message || 'Update failed';
          this.isUploading = false;
        }
      });
    } else {
      this.citiesService.store(data).subscribe({
        next: () => this.afterSave('City created successfully'),
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
    this.cityModal.hide();
    this.loadCities();
    this.resetForm();
  }

  openCreateModal() {
    this.resetForm();
    this.cityModal.show();
  }

  openUpdateModal(city: any) {
    this.isEditMode = true;
    this.errorMessage = '';
    
    // Fetch full city details with translations
    this.citiesService.show(city.id).subscribe({
      next: (res: any) => {
        const fullCity = res.data || res;
        
        let titleObj: any = {};
        
        if (typeof fullCity.title === 'object' && fullCity.title !== null) {
          titleObj = { ...fullCity.title };
        } else if (typeof fullCity.title === 'string') {
          titleObj = { en: fullCity.title, ar: fullCity.title };
        }
        
        this.form = { 
          id: fullCity.id, 
          title: titleObj,
          country_id: fullCity.country_id || fullCity.country?.id
        };
        
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
        this.cityModal.show();
      },
      error: (err) => {
        console.error('Failed to load city details:', err);
        if (err.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = 'Failed to load city details: ' + (err.error?.message || err.message);
        }
      }
    });
  }

  confirmDelete(id: number) {
    this.cityToDelete = id;
    this.deleteModal.show();
  }

  deleteConfirmed() {
    if (!this.cityToDelete) return;
    this.citiesService.delete(this.cityToDelete).subscribe({
      next: () => {
        this.successMessage = 'City deleted';
        this.loadCities();
      },
      error: (err) => {
        this.errorMessage = 'Delete failed';
      }
    });
    this.deleteModal.hide();
  }

  get activeLang() {
    return this.selectedLangs[this.activeTabIndex];
  }

  resetForm() {
    this.form = { id: null, title: { en: '', ar: '' }, country_id: '' };
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
      this.errorMessage = 'You must keep at least one language';
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
