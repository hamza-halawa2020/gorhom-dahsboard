import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private apiUrl = environment.backEndUrl;
  private data = '/posts';

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
    return this.http.get(`${this.apiUrl}/posts?page=${page}`);
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
  deleteComment(eventId: string, commentId: string) {
    return this.http.delete(
      `${this.apiUrl}${this.data}/${eventId}/comments/${commentId}`
    );
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
