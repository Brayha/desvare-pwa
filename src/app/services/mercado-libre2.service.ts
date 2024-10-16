import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercadoLibre2Service {
  private apiUrl = 'https://api.mercadolibre.com';

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sites/MCO/categories`);
  }

  buscarVehiculos(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/sites/MCO/search?category=MCO1743&q=${query}`);
  }
}