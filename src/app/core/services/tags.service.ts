import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from 'src/app/pages/apps/tags/tag.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
 private apiUrl = environment.backEndUrl;
  private data = '/tags';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/tags?page=${page}`);
  }

  store(body: Tag) {
    return this.http.post(`${this.apiUrl}${this.data}`, body);
  }
  update(body: Tag) {
    return this.http.put(`${this.apiUrl}${this.data}/${body.id}`, body);
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}