import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocialLinksService {
 private apiUrl = environment.backEndUrl;
  private data = '/social-links';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/social-links?page=${page}`);
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
