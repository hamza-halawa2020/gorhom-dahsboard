import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private apiUrl = environment.backEndUrl;
  private data = '/reviews';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/reviews?page=${page}`, {
      withCredentials: true,
    });
  }

  getAllProducts() {
    return this.http.get(`${this.apiUrl}/products`, {
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

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url, {
      withCredentials: true,
    });
  }
}
