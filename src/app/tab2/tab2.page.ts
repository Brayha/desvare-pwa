import { Component, ViewChild } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalAddressComponent } from '../modal-address/modal-address.component';
import { MapaComponent } from '../mapa/mapa.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, MapaComponent, ModalAddressComponent, CommonModule]
})
export class Tab2Page {
  @ViewChild(MapaComponent) mapaComponent!: MapaComponent;

  currentAddress: string = '';
  destinoSeleccionado: {
    address: string;
    lat: number;
    lng: number;
  } | null = null;
  direccionOrigen: string = '';
  mostrarBusqueda: boolean = true;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.mostrarBusqueda = true;
  }

  onAddressChanged(address: string) {
    this.currentAddress = address;
  }

  async abrirModalDestino() {
    const modal = await this.modalCtrl.create({
      component: ModalAddressComponent,
      componentProps: {
        origen: this.currentAddress,
        destinoActual: this.destinoSeleccionado?.address // Añade esta línea
      }
    });

    console.log('Abriendo modal con origen:', this.currentAddress);

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.destinoSeleccionado = {
        address: data.direccion,
        lat: data.lat,
        lng: data.lng
      };
      this.mostrarBusqueda = false;
      this.trazarRuta();
    }
  }

  trazarRuta() {
    if (this.mapaComponent && this.destinoSeleccionado) {
      this.mapaComponent.trazarRuta();
    }
  }

  volverABusqueda() {
    this.mostrarBusqueda = true;
    this.destinoSeleccionado = null;
  }
}