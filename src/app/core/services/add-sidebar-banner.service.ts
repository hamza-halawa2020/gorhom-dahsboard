import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddSidebarBannerService {
  private apiUrl = environment.backEndUrl;
  private data = '/side-bar-banners';

  constructor(private http: HttpClient) {}

  adminIndex(page: number = 1) {
    return this.http.get(`${this.apiUrl}/side-bar-banners-all?page=${page}`);
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
