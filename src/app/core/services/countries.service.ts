import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Country } from 'src/app/pages/apps/countries/country.model';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private apiUrl = environment.backEndUrl;
  private data = '/countries';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/countries?page=${page}`);
  }

  store(body: Country) {
    return this.http.post(`${this.apiUrl}${this.data}`, body);
  }
  update(body: Country) {
    return this.http.put(`${this.apiUrl}${this.data}/${body.id}`, body);
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
