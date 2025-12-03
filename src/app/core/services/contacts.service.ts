import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private apiUrl = environment.backEndUrl;
  private data = '/contacts';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/contacts?page=${page}`);
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
