import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Brand {
  id: string;
  name: string;
  total_items: number;
}

export interface Model {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MercadoLibreService {
  private readonly API_URL = 'https://api.mercadolibre.com/sites/MCO';

  constructor(private http: HttpClient) {}

  getVehicleBrands(categoryId: string): Observable<Brand[]> {
    return this.http.get<any>(`${this.API_URL}/search?category=${categoryId}&limit=50`)
      .pipe(
        map(response => {
          const brandsMap = new Map<string, Brand>();
          
          response.results.forEach((item: any) => {
            const brandAttribute = item.attributes.find((attr: any) => attr.id === 'BRAND');
            if (brandAttribute) {
              if (!brandsMap.has(brandAttribute.value_id)) {
                brandsMap.set(brandAttribute.value_id, {
                  id: brandAttribute.value_id,
                  name: brandAttribute.value_name,
                  total_items: 1
                });
              } else {
                const brand = brandsMap.get(brandAttribute.value_id)!;
                brand.total_items++;
              }
            }
          });
          
          return Array.from(brandsMap.values())
            .sort((a, b) => a.name.localeCompare(b.name));
        })
      );
  }
  getVehicleModels(categoryId: string, brandId: string): Observable<Model[]> {
    return this.http.get<any>(`${this.API_URL}/search?category=${categoryId}&brand=${brandId}&limit=50`)
      .pipe(
        map(response => {
          const modelsMap = new Map<string, Model>();
          
          response.results.forEach((item: any) => {
            const modelAttribute = item.attributes.find((attr: any) => attr.id === 'MODEL');
            if (modelAttribute) {
              if (!modelsMap.has(modelAttribute.value_id)) {
                modelsMap.set(modelAttribute.value_id, {
                  id: modelAttribute.value_id,
                  name: modelAttribute.value_name
                });
              }
            }
          });
          
          return Array.from(modelsMap.values())
            .sort((a, b) => a.name.localeCompare(b.name));
        })
      );
  }
}