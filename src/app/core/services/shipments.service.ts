import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShipmentsService {
  private apiUrl = environment.backEndUrl;
  private data = '/shipments';
  private countries = '/countries';
  private cities = '/cities';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/shipments?page=${page}`, {
      withCredentials: true,
    });
  }
  
  getAllCountries() {
    return this.http.get(`${this.apiUrl}${this.countries}`, {
      withCredentials: true,
    });
  }

  getCitiesByCountry(countryId: number) {
    return this.http.get(`${this.apiUrl}${this.cities}?country_id=${countryId}`, {
      withCredentials: true,
    });
  }
  
  store(body: any) {
    return this.http.post(`${this.apiUrl}${this.data}`, body, {
      withCredentials: true,
    });
  }
  
  show(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.get(url, {
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
