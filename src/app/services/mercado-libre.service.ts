import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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

  // Mapa de tipos de vehículos a categorías de MercadoLibre
  private vehicleCategories: { [key: string]: string } = {
    'motocicleta': 'MCO1763',
    'automovil': 'MCO1744',
    'camioneta': 'MCO1745',
    'camion': 'MCO1748',
    'bus': 'MCO1747'
  };

  constructor(private http: HttpClient) {}

  getVehicleBrands(vehicleType: string): Observable<Brand[]> {
    const categoryId = this.vehicleCategories[vehicleType];
    if (!categoryId) {
      return throwError(() => new Error('Tipo de vehículo no válido'));
    }

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
        }),
        catchError(error => {
          console.error('Error al obtener las marcas:', error);
          return throwError(() => new Error('Error al cargar las marcas. Por favor, intenta de nuevo.'));
        })
      );
  }

  getVehicleModels(vehicleType: string, brandId: string): Observable<Model[]> {
    const categoryId = this.vehicleCategories[vehicleType];
    if (!categoryId) {
      return throwError(() => new Error('Tipo de vehículo no válido'));
    }

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
        }),
        catchError(error => {
          console.error('Error al obtener los modelos:', error);
          return throwError(() => new Error('Error al cargar los modelos. Por favor, intenta de nuevo.'));
        })
      );
  }
}