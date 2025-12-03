import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from 'src/app/core/services/translate.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';

// @ts-ignore: Ignore if TypeScript doesn't recognize bootstrap types
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss'],
})
export class TranslateComponent implements OnInit {
  translates: { ar: { [key: string]: string }; en: { [key: string]: string } } =
    {
      ar: {},
      en: {},
    };

  successMessage: string = '';
  errorMessage: string = '';
  selectedLang: 'ar' | 'en' = 'en';
  newKey: string = '';
  newValue: string = '';
  keyToDelete: string = '';
  isLoading: boolean = false;

  @ViewChild('translateForm') translateForm!: NgForm;
  @ViewChild('deleteModal') deleteModalEl!: ElementRef;

  private _modalRef: any;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.loadTranslations();
  }

  loadTranslations(): void {
    this.isLoading = true;
    this.translateService.getTranslations().subscribe({
      next: (data: any) => {
        this.translates = {
          ar: data?.translations?.ar || {},
          en: data?.translations?.en || {},
        };
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = `Failed to load translations: ${err.status} - ${err.message}`;
        this.translates = { ar: {}, en: {} };
        this.isLoading = false;
        setTimeout(() => (this.errorMessage = ''), 5000);
      },
    });
  }

  addTranslate(): void {
    if (this.translateForm.valid && this.newKey && this.newValue) {
      this.isLoading = true;
      this.translates[this.selectedLang][this.newKey.trim()] =
        this.newValue.trim();
      this.updateTranslations();
      this.newKey = '';
      this.newValue = '';
      this.translateForm.resetForm();
    }
  }

  showDeleteModal(key: string): void {
    this.keyToDelete = key;
    const modal = new bootstrap.Modal(this.deleteModalEl.nativeElement);
    modal.show();
    this._modalRef = modal;
  }

  hideDeleteModal(): void {
    if (this._modalRef) {
      this._modalRef.hide();
    }
  }

  confirmDelete(): void {
    this.deleteTranslate();
    this.hideDeleteModal();
  }

  deleteTranslate(): void {
    if (this.keyToDelete) {
      this.isLoading = true;
      delete this.translates[this.selectedLang][this.keyToDelete];
      this.updateTranslations();
      this.keyToDelete = '';
    }
  }

  updateTranslations(): void {
    this.translateService
      .update(this.selectedLang, this.translates[this.selectedLang])
      .subscribe({
        next: () => {
          this.successMessage = 'Translations updated successfully!';
          this.isLoading = false;
          setTimeout(() => (this.successMessage = ''), 5000);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = `Failed to update translations: ${err.message}`;
          this.isLoading = false;
          setTimeout(() => (this.errorMessage = ''), 5000);
        },
      });
  }

  downloadFile(lang: 'ar' | 'en'): void {
    window.open(`${environment.i18nUrl}${lang}.json`, '_blank');
  }
}
