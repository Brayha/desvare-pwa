import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent {
  constructor(private modalController: ModalController) { }
  showOtp: boolean = false;
  logeado: boolean = false;


  segmentValue: string = 'register';
  vehicles = [
    { name: 'Motocicleta', description: 'Vehículos de 2 ruedas', icon: '/assets/icon-vehicle-type/Moto.svg' },
    { name: 'Automóvil', description: 'Vehículos de 2 y 4 puertas', icon: '/assets/icon-vehicle-type/Automovil.svg' },
    { name: 'Camioneta', description: 'De platón y cajón', icon: '/assets/icon-vehicle-type/Camioneta.svg' },
    { name: 'Camión', description: 'Furgón o estacas', icon: '/assets/icon-vehicle-type/Camion.svg' },
    { name: 'Autobus', description: 'Transporte urbano e intermunicipal', icon: '/assets/icon-vehicle-type/Autobus.svg' },
    { name: 'Otra carga', description: 'Trasteos, maquinaria, etc...', icon: '/assets/icon-vehicle-type/Otra.svg' }
  ];

  dismissModal() {
    this.modalController.dismiss();
  }


}