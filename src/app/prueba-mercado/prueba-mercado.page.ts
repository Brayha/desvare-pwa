import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { MercadoLibre2Service } from '../services/mercado-libre2.service';

@Component({
  selector: 'app-prueba-mercado',
  templateUrl: './prueba-mercado.page.html',
  styleUrls: ['./prueba-mercado.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, CommonModule, FormsModule]
})
export class PruebaMercadoPage implements OnInit {
  categorias: any[] = [];
  marcas: string[] = [];
  modelos: string[] = [];
  categoriaSeleccionada: string = '';
  marcaSeleccionada: string = '';
  modeloSeleccionado: string = '';

  constructor(private mercadoLibreService: MercadoLibre2Service) { }

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.mercadoLibreService.getCategorias().subscribe(
      (categorias) => {
        this.categorias = categorias;
      },
      (error) => {
        console.error('Error al cargar categorías:', error);
      }
    );
  }

  onCategoriaChange() {
    this.marcas = [];
    this.modelos = [];
    this.marcaSeleccionada = '';
    this.modeloSeleccionado = '';
    if (this.categoriaSeleccionada) {
      this.cargarMarcas();
    }
  }

  cargarMarcas() {
    this.mercadoLibreService.getMarcas(this.categoriaSeleccionada).subscribe(
      (marcas) => {
        this.marcas = marcas;
      },
      (error) => {
        console.error('Error al cargar marcas:', error);
      }
    );
  }

  onMarcaChange() {
    this.modelos = [];
    this.modeloSeleccionado = '';
    if (this.marcaSeleccionada) {
      this.cargarModelos();
    }
  }

  cargarModelos() {
    this.mercadoLibreService.getModelos(this.categoriaSeleccionada, this.marcaSeleccionada).subscribe(
      (modelos) => {
        this.modelos = modelos;
      },
      (error) => {
        console.error('Error al cargar modelos:', error);
      }
    );
  }
}