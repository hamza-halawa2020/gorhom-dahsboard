import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Client } from 'src/app/pages/apps/clients/client.model';
@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private apiUrl = environment.backEndUrl;
  private data = '/clients';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/clients?page=${page}`);
  }

  store(body: Client) {
    return this.http.post(`${this.apiUrl}${this.data}`, body);
  }
  update(body: Client) {
    return this.http.put(`${this.apiUrl}${this.data}/${body.id}`, body);
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
