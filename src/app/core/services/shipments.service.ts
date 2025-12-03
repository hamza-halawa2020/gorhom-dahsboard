import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Shipment } from 'src/app/pages/apps/shipments/shipment.model';
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
    return this.http.get(`${this.apiUrl}/shipments?page=${page}`);
  }
  getAllCountries() {
    return this.http.get(`${this.apiUrl}${this.countries}`);
  }

  getCitiesByCountry(countryId: number) {
    return this.http.get(
      `${this.apiUrl}${this.cities}${this.countries}/${countryId}`
    );
  }
  store(body: Shipment) {
    return this.http.post(`${this.apiUrl}${this.data}`, body);
  }
  show(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.get(url);
  }
  update(body: Shipment) {
    return this.http.put(`${this.apiUrl}${this.data}/${body.id}`, body);
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
