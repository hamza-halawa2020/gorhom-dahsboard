import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private apiUrl = `${environment.backEndUrl}/translations`; // e.g., https://new-backend.gorhom.net/api/translations

  constructor(private http: HttpClient) {}

  // Fetch all translations at once from the index endpoint
  getTranslations(): Observable<{
    ar: { [key: string]: string };
    en: { [key: string]: string };
  }> {
    return this.http.get<{
      ar: { [key: string]: string };
      en: { [key: string]: string };
    }>(`${this.apiUrl}/index`);
  }

  update(lang: string, translations: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, { lang, translations });
  }
}
