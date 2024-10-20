import { Component, ViewChild } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalAddressComponent } from '../modal-address/modal-address.component';
import { MapaComponent } from '../mapa/mapa.component';
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from '../components/auth-modal/auth-modal.component';
import { Router } from '@angular/router';
import { ConfirmServiceModalComponent } from '../confirm-service-modal/confirm-service-modal.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, MapaComponent, ModalAddressComponent, CommonModule, AuthModalComponent, ConfirmServiceModalComponent]
})
export class Tab2Page {
  @ViewChild(MapaComponent) mapaComponent!: MapaComponent;

  currentAddress: { address: string } = { address: '' };
  destinoSeleccionado: {
    address: string;
    lat: number;
    lng: number;
  } | null = null;
  direccionOrigen: string = '';
  mostrarBusqueda: boolean = true;
  confirmarRuta: boolean = false;
  modalAbierto: boolean = false;

  constructor(private modalCtrl: ModalController, private modalController: ModalController, private router: Router) { }

  ngOnInit() {
    this.mostrarBusqueda = true;
  }
  
  async iniciarProceso() {
    const modal = await this.modalController.create({
      component: AuthModalComponent,
      componentProps: {
        origen: this.currentAddress,
        destino: this.destinoSeleccionado
      },
      breakpoints: [0, 0.5, 0.8, 1],
      initialBreakpoint: 0.5,
      mode: 'ios'
    });

    
    await modal.present();
  
    const { data } = await modal.onDidDismiss();
    this.modalAbierto = true;
    if (data && data.openConfirmService) {
      this.openConfirmServiceModal(data.userData);
    }
  }
  
  async openConfirmServiceModal(userData: any) {
    const modal = await this.modalController.create({
      component: ConfirmServiceModalComponent,
      componentProps: {
        userData: userData.userInfo,
        vehicleData: userData.vehicleInfo,
        origen: userData.origen,
        destino: userData.destino
      },
      cssClass: 'confirm-service-modal',
      backdropDismiss: false,
      breakpoints: [0.4, 0.4, 0.92],
      initialBreakpoint: 0.4,
      backdropBreakpoint: 0.5,
      mode: 'ios'
    });
  
    await modal.present();
  
    const { data } = await modal.onDidDismiss();
    if (data && data.confirmed) {
      console.log('Servicio confirmado');
      // Aquí puedes manejar la confirmación del servicio
    }
  }

  onAddressChanged(address: string) {
    this.currentAddress = { address: address };
    console.log('Dirección de origen actualizada:', this.currentAddress);
  }

  async abrirModalDestino() {
    const modal = await this.modalCtrl.create({
      component: ModalAddressComponent,
      componentProps: {
        origen: this.currentAddress.address,
        destinoActual: this.destinoSeleccionado?.address
      }
    });
  
    console.log('Abriendo modal con origen:', this.currentAddress);
  
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data) {
      let actualizarRuta = false;
  
      if (data.origen) {
        this.currentAddress = { address: data.origen };
        console.log('Origen actualizado:', this.currentAddress);
        if (data.origenLat && data.origenLng) {
          // Actualizar la posición del usuario en el mapa
          this.mapaComponent.actualizarPosicionUsuario({ lat: data.origenLat, lng: data.origenLng });
        }
        actualizarRuta = true;
      }
  
      if (data.destino) {
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