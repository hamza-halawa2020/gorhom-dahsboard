import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from 'src/app/pages/apps/orders/order.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = environment.backEndUrl;
  private data = '/orders';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/orders?page=${page}`);
  }

  exportPendingOrders() {
    return this.http.get(`${this.apiUrl}/orders-export`, {
      responseType: 'blob',
    });
  }
  store(body: Order) {
    return this.http.post(`${this.apiUrl}${this.data}`, body);
  }
  update(body: Order) {
    return this.http.put(`${this.apiUrl}${this.data}/${body.id}`, body);
  }

  updateStatus(orderId: number, status: string) {
    const url = `${this.apiUrl}/orders-change/${orderId}`;
    return this.http.post(url, { status });
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
