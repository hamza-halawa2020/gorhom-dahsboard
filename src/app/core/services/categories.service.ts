import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Category } from 'src/app/pages/apps/categories/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = environment.backEndUrl;
  private data = '/categories';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/categories?page=${page}`);
  }

  store(body: FormData) {
    return this.http.post(`${this.apiUrl}${this.data}`, body);
  }
  update(id: number, body: FormData) {
    return this.http.post(`${this.apiUrl}${this.data}/${id}`, body);
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
