import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = environment.backEndUrl;
  private data = '/products';

  constructor(private http: HttpClient) { }

  getAllCategories() {
    return this.http.get(`${this.apiUrl}/categories`, {
      withCredentials: true,
    });
  }

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/products?page=${page}`, {
      withCredentials: true,
    });
  }

  store(body: FormData) {
    return this.http.post(`${this.apiUrl}${this.data}`, body, {
      withCredentials: true,
    });
  }

  update(id: number, body: FormData) {
    return this.http.post(`${this.apiUrl}${this.data}/${id}`, body, {
      withCredentials: true,
    });
  }

  show(id: number) {
    // Request with 'all' lang to get all translations
    return this.http.get(`${this.apiUrl}${this.data}/${id}?lang=all`, {
      withCredentials: true,
    });
  }

  deleteComment(productId: string, commentId: string) {
    return this.http.delete(
      `${this.apiUrl}${this.data}/${productId}/comments/${commentId}`,
      { withCredentials: true }
    );
  }

  deleteImage(productId: string, imageId: string) {
    return this.http.delete(
      `${this.apiUrl}${this.data}/${productId}/images/${imageId}`,
      { withCredentials: true }
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}${this.data}/${id}`, {
      withCredentials: true,
    });
  }
}
