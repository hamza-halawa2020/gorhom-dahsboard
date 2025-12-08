import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/pages/apps/user/user.model';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private apiUrl = environment.backEndUrl;
  constructor(private http: HttpClient) {}
  private data = '/users';
  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}${this.data}?page=${page}`, {
      withCredentials: true,
    });
  }

  profile() {
    return this.http.get(`${this.apiUrl}/profile`);
  }
  store(body: FormData) {
    return this.http.post(`${this.apiUrl}${this.data}`, body, {
      withCredentials: true,
    });
  }
  updateUser(id: number, body: FormData) {
    return this.http.post(`${this.apiUrl}${this.data}/${id}`, body, {
      withCredentials: true,
    });
  }
  show(id: any) {
    // Request with 'all' lang to get all translations (if applicable)
    const url = `${this.apiUrl}${this.data}/${id}?lang=all`;
    return this.http.get(url, {
      withCredentials: true,
    });
  }
  update(body: any) {
    const id = body.id;
    return this.http.put(`${this.apiUrl}${this.data}/${id}`, body, {
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
