import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  getMarcas(): Observable<string[]> {
    return this.buscarVehiculos('').pipe(
      map(data => {
        const marcasSet = new Set<string>();
        data.results.forEach((item: any) => {
          const marca = item.title.split(' ')[0];
          marcasSet.add(marca);
        });
        return Array.from(marcasSet).sort();
      })
    );
  }

  getModelos(marca: string): Observable<string[]> {
    return this.buscarVehiculos(marca).pipe(
      map(data => {
        const modelosSet = new Set<string>();
        data.results.forEach((item: any) => {
          const [, modelo] = item.title.split(' ', 2);
          if (modelo) modelosSet.add(modelo);
        });
        return Array.from(modelosSet).sort();
      })
    );
  }
}