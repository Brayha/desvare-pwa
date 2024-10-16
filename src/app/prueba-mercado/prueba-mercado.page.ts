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
  marcas: string[] = [];
  modelos: string[] = [];
  marcaSeleccionada: string = '';
  modeloSeleccionado: string = '';

  constructor(private mercadoLibreService: MercadoLibre2Service) { }

  ngOnInit() {
    this.cargarMarcas();
  }

  cargarMarcas() {
    this.mercadoLibreService.getMarcas().subscribe(
      (marcas) => {
        this.marcas = marcas;
      },
      (error) => {
        console.error('Error al cargar marcas:', error);
      }
    );
  }

  onMarcaChange() {
    if (this.marcaSeleccionada) {
      this.mercadoLibreService.getModelos(this.marcaSeleccionada).subscribe(
        (modelos) => {
          this.modelos = modelos;
        },
        (error) => {
          console.error('Error al cargar modelos:', error);
        }
      );
    } else {
      this.modelos = [];
    }
    this.modeloSeleccionado = '';
  }
}