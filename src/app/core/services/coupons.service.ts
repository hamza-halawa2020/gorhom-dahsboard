import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Coupon } from 'src/app/pages/apps/coupons/coupon.model';

@Injectable({
  providedIn: 'root',
})
export class CouponsService {
  private apiUrl = environment.backEndUrl;
  private data = '/coupons';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/coupons?page=${page}`);
  }

  store(body: Coupon) {
    return this.http.post(`${this.apiUrl}${this.data}`, body);
  }

  update(coupon: Coupon) {
    return this.http.put(`${this.apiUrl}${this.data}/${coupon.id}`, coupon);
  }
  show(id: number) {
    return this.http.get(`${this.apiUrl}${this.data}/${id}`);
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
