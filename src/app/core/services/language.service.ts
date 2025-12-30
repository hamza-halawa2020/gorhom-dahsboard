import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('ar');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.setLanguage('ar');
  }

  setLanguage(language: string): void {
    this.translate.use(language);
    this.currentLanguageSubject.next(language);
    
    const htmlElement = document.documentElement;
    if (language === 'ar') {
      htmlElement.setAttribute('dir', 'rtl');
      htmlElement.setAttribute('lang', 'ar');
    } else {
      htmlElement.setAttribute('dir', 'ltr');
      htmlElement.setAttribute('lang', 'en');
    }
    
    // حفظ اللغة في localStorage
    localStorage.setItem('selectedLanguage', language);
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  getStoredLanguage(): string {
    return localStorage.getItem('selectedLanguage') || 'ar';
  }

  initializeLanguage(): void {
    const storedLanguage = this.getStoredLanguage();
    this.setLanguage(storedLanguage);
  }

  toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  }
}