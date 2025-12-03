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
    return this.http.get(`${this.apiUrl}/cities?page=${page}`);
  }

  getAllCountries() {
    return this.http.get(`${this.apiUrl}${this.countries}`);
  }
  store(body: City) {
    return this.http.post(`${this.apiUrl}${this.data}`, body);
  }
  update(body: City) {
    return this.http.put(`${this.apiUrl}${this.data}/${body.id}`, body);
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
