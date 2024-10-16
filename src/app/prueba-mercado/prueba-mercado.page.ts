import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { MercadoLibre2Service } from '../services/mercado-libre2.service';

@Component({
  selector: 'app-prueba-mercado',
  templateUrl: './prueba-mercado.page.html',
  styleUrls: ['./prueba-mercado.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonList, IonItem, IonLabel, CommonModule, FormsModule]
})
export class PruebaMercadoPage implements OnInit {
  categorias: any[] = [];
  resultadosBusqueda: any[] = [];

  constructor(private mercadoLibreService: MercadoLibre2Service) { }

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.mercadoLibreService.getCategorias().subscribe(
      (data) => {
        this.categorias = data.filter((cat: any) => cat.id === 'MCO1743')[0].children_categories;
      },
      (error) => {
        console.error('Error al cargar categorías:', error);
      }
    );
  }

  buscarVehiculos(event: any) {
    const query = event.target.value.toLowerCase();
    if (query && query.length > 2) {
      this.mercadoLibreService.buscarVehiculos(query).subscribe(
        (data) => {
          const resultadosUnicos = new Map<string, any>();
          data.results.forEach((item: any) => {
            const [marca, modelo] = item.title.split(' ', 2);
            const key = `${marca} ${modelo}`.toLowerCase();
            if (!resultadosUnicos.has(key)) {
              resultadosUnicos.set(key, { marca, modelo });
            }
          });
          this.resultadosBusqueda = Array.from(resultadosUnicos.values());
        },
        (error) => {
          console.error('Error en la búsqueda:', error);
        }
      );
    } else {
      this.resultadosBusqueda = [];
    }
  }
}