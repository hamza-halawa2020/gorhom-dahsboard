import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private apiUrl = environment.backEndUrl;
  private data = '/clients';

  constructor(private http: HttpClient) {}

  index(page: number = 1, filters?: any) {
    let url = `${this.apiUrl}/clients?page=${page}`;
    if (filters) {
      if (filters.phone) url += `&phone=${filters.phone}`;
      if (filters.name) url += `&name=${filters.name}`;
      if (filters.email) url += `&email=${filters.email}`;
      if (filters.with_orders) url += `&with_orders=1`;
    }
    return this.http.get(url, {
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

  getByPhone(phone: string) {
    return this.http.get(`${this.apiUrl}${this.data}/phone/${phone}`, {
      withCredentials: true,
    });
  }

  getStats(id: number) {
    return this.http.get(`${this.apiUrl}${this.data}/${id}/stats`, {
      withCredentials: true,
    });
  }
}
