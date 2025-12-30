import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  template: `
    <div dropdown class="dropdown">
      <button dropdownToggle type="button" 
              class="btn btn-ghost-light btn-icon rounded-circle">
        <i class="ri-global-line fs-16"></i>
      </button>
      <ul *dropdownMenu class="dropdown-menu dropdown-menu-end">
        <li>
          <h6 class="dropdown-header">اختر اللغة</h6>
        </li>
        <li>
          <a class="dropdown-item" href="javascript:void(0)" (click)="switchLanguage('ar')" 
             [class.active]="currentLanguage === 'ar'">
            <i class="bi bi-check2 me-2" *ngIf="currentLanguage === 'ar'"></i>
            <span class="ms-4" *ngIf="currentLanguage !== 'ar'"></span>
            العربية
          </a>
        </li>
        <li>
          <a class="dropdown-item" href="javascript:void(0)" (click)="switchLanguage('en')" 
             [class.active]="currentLanguage === 'en'">
            <i class="bi bi-check2 me-2" *ngIf="currentLanguage === 'en'"></i>
            <span class="ms-4" *ngIf="currentLanguage !== 'en'"></span>
            English
          </a>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .dropdown-item.active {
      background-color: var(--tb-primary);
      color: white;
    }
    .dropdown-item:hover {
      background-color: var(--tb-light);
    }
  `]
})
export class LanguageSwitcherComponent implements OnInit {
  currentLanguage: string = 'ar';

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  switchLanguage(language: string): void {
    this.languageService.setLanguage(language);
  }
}