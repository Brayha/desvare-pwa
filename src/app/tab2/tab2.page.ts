import { Component, ViewChild } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalAddressComponent } from '../modal-address/modal-address.component';
import { MapaComponent } from '../mapa/mapa.component';
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from '../components/auth-modal/auth-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, MapaComponent, ModalAddressComponent, CommonModule, AuthModalComponent]
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

  constructor(private modalCtrl: ModalController, private modalController: ModalController, private router: Router) { }

  ngOnInit() {
    this.mostrarBusqueda = true;
  }
  

  async iniciarProceso() {
    const modal = await this.modalController.create({
      component: AuthModalComponent,
      breakpoints: [0, 0.5, 0.8, 1],
      initialBreakpoint: 0.5,
      mode: 'ios'
    });
    await modal.present();
  }

  onAddressChanged(address: string) {
    this.currentAddress = address;
  }

  async abrirModalDestino() {
    const modal = await this.modalCtrl.create({
      component: ModalAddressComponent,
      componentProps: {
        origen: this.currentAddress,
        destinoActual: this.destinoSeleccionado?.address
      }
    });

    console.log('Abriendo modal con origen:', this.currentAddress);

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      let actualizarRuta = false;

      if (data.origenLat && data.origenLng) {
        this.currentAddress = data.origen;
        // Actualizar la posición del usuario en el mapa
        this.mapaComponent.actualizarPosicionUsuario({ lat: data.origenLat, lng: data.origenLng });
        actualizarRuta = true;
      }
      if (data.destinoLat && data.destinoLng) {
        this.destinoSeleccionado = {
          address: data.destino,
          lat: data.destinoLat,
          lng: data.destinoLng
        };
        this.mostrarBusqueda = false;
        actualizarRuta = true;
      }

      if (actualizarRuta && this.destinoSeleccionado) {
        this.trazarRuta();
      }
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