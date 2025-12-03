import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = environment.backEndUrl;
  private data = '/events';

  constructor(private http: HttpClient) {}

  getAllCategories() {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  getAllTags() {
    return this.http.get(`${this.apiUrl}/tags`);
  }
  getAllInstructors() {
    return this.http.get(`${this.apiUrl}/instructors`);
  }
  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/events?page=${page}`);
  }

  store(body: FormData) {
    return this.http.post(`${this.apiUrl}${this.data}`, body);
  }

  update(id: number, body: FormData) {
    return this.http.post(`${this.apiUrl}${this.data}/${id}`, body);
  }
  show(id: number) {
    return this.http.get(`${this.apiUrl}${this.data}/${id}`);
  }
  deleteImage(eventId: string, imageId: string) {
    return this.http.delete(
      `${this.apiUrl}${this.data}${eventId}/images/${imageId}`
    );
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
