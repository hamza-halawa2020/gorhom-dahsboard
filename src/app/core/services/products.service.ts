import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = environment.backEndUrl;
  private data = '/products';

  constructor(private http: HttpClient) {}

  getAllCategories() {
    return this.http.get(`${this.apiUrl}/categories`);
  }

 index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/products?page=${page}`);
  }

  store(body: FormData) {
    return this.http.post(`${this.apiUrl}${this.data}`, body);
  }

  update(id: number, body: FormData) {
    return this.http.post(`${this.apiUrl}${this.data}/${id}`, body);
  }
  show(id: number) {
    return this.http.get(`${this.apiUrl}${this.data}/${id}`);
  }
  deleteComment(productId: string, commentId: string) {
    return this.http.delete(
      `${this.apiUrl}${this.data}/${productId}/comments/${commentId}`
    );
  }

  deleteImage(productId: string, imageId: string) {
    return this.http.delete(
      `${this.apiUrl}${this.data}/${productId}/images/${imageId}`
    );
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
