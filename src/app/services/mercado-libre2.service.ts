import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MercadoLibre2Service {
  private apiUrl = 'https://api.mercadolibre.com';

  private categoriasVehiculos = [
    { id: "MCO1744", name: "Carros y Camionetas" },
    { id: "MCO1763", name: "Motos" },
    { id: "MCO1907", name: "Otros Vehículos" },
    { id: "MCO41696", name: "Camiones" }
  ];

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<any[]> {
    return of(this.categoriasVehiculos);
  }

  buscarVehiculos(categoryId: string, query: string = ''): Observable<any> {
    return this.http.get(`${this.apiUrl}/sites/MCO/search?category=${categoryId}&q=${query}`);
  }

  getMarcas(categoryId: string): Observable<string[]> {
    return this.buscarVehiculos(categoryId).pipe(
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

  getModelos(categoryId: string, marca: string): Observable<string[]> {
    return this.buscarVehiculos(categoryId, marca).pipe(
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