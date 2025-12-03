import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AddreesesService {
  private apiUrl = environment.backEndUrl;
  constructor(private http: HttpClient) {}
  adminIndex(page: number = 1) {
    return this.http.get(`${this.apiUrl}/addresses-admin?page=${page}`);
  }
}
