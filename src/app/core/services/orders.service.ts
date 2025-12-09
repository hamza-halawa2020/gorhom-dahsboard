import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = environment.backEndUrl;
  private data = '/orders';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/orders?page=${page}`, {
      withCredentials: true,
    });
  }

  store(body: any) {
    return this.http.post(`${this.apiUrl}${this.data}`, body, {
      withCredentials: true,
    });
  }

  show(id: number) {
    return this.http.get(`${this.apiUrl}${this.data}/${id}`, {
      withCredentials: true,
    });
  }

  updateStatus(orderId: number, status: string) {
    return this.http.patch(`${this.apiUrl}${this.data}/${orderId}/status`, 
      { status }, 
      { withCredentials: true }
    );
  }

  getClientOrders(phone: string) {
    return this.http.get(`${this.apiUrl}${this.data}/client/${phone}`, {
      withCredentials: true,
    });
  }

  exportPendingOrders() {
    return this.http.get(`${this.apiUrl}/orders-export`, {
      responseType: 'blob',
      withCredentials: true,
    });
  }
}
