import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { City } from 'src/app/pages/apps/cities/city.model';
@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private apiUrl = environment.backEndUrl;
  private data = '/cities';
  private countries = '/countries';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/cities?page=${page}`, {
      withCredentials: true,
    });
  }

  getAllCountries() {
    return this.http.get(`${this.apiUrl}${this.countries}`, {
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

  show(id: number) {
    // Request with 'all' lang to get all translations
    return this.http.get(`${this.apiUrl}${this.data}/${id}?lang=all`, {
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
