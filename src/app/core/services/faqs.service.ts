import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Faq } from 'src/app/pages/apps/faqs/faq.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FaqsService {
  private apiUrl = environment.backEndUrl;
  private data = '/faqs';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/faqs?page=${page}`);
  }

  store(body: Faq) {
    return this.http.post(`${this.apiUrl}${this.data}`, body);
  }

  update(body: Faq) {
    return this.http.put(`${this.apiUrl}${this.data}/${body.id}`, body);
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
