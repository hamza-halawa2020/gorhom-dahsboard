import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CouponsService {
  private apiUrl = environment.backEndUrl;
  private data = '/coupons';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/coupons?page=${page}`, {
      withCredentials: true,
    });
  }

  store(body: any) {
    return this.http.post(`${this.apiUrl}${this.data}`, body, {
      withCredentials: true,
    });
  }

  update(id: number, body: any) {
    return this.http.post(`${this.apiUrl}${this.data}/${id}`, body, {
      withCredentials: true,
    });
  }

  show(id: number) {
    return this.http.get(`${this.apiUrl}${this.data}/${id}`, {
      withCredentials: true,
    });
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url, {
      withCredentials: true,
    });
  }

  validate(code: string, orderAmount: number, clientId: number) {
    return this.http.post(`${this.apiUrl}${this.data}/validate`, {
      code,
      order_amount: orderAmount,
      client_id: clientId
    }, {
      withCredentials: true,
    });
  }

  getAutomaticCoupon(clientId: number) {
    return this.http.get(`${this.apiUrl}${this.data}/automatic/first-order?client_id=${clientId}`, {
      withCredentials: true,
    });
  }
}
