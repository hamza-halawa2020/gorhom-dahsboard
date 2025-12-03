import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductReview } from '../../pages/apps/product-review/product-review.model';

@Injectable({
  providedIn: 'root'
})
export class ProductReviewService {


  private apiUrl = environment.backEndUrl;
  private data = '/product-reviews';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/product-reviews-all?page=${page}`);
  }

  getAllProducts() {
    return this.http.get(`${this.apiUrl}/products`);
  }

  store(body: ProductReview) {
    return this.http.post(`${this.apiUrl}${this.data}`, body);
  }

  update(body: ProductReview) {
    return this.http.put(
      `${this.apiUrl}/product-reviews-update/${body.id}`,
      body
    );
  }
  show(id: number) {
    return this.http.get(`${this.apiUrl}${this.data}/${id}`);
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
