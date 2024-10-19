import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-service-modal',
  template: `
    <ion-content class="ion-padding">
      <h1>Confirmar Servicio</h1>
      <p>¿Estás seguro de que deseas confirmar este servicio?</p>
      <ion-button (click)="confirmar()">Confirmar</ion-button>
      <ion-button (click)="cancelar()">Cancelar</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule]
})
export class ConfirmServiceModalComponent {
  constructor(private modalCtrl: ModalController) {}

  confirmar() {
    this.modalCtrl.dismiss({ confirmed: true });
  }

  cancelar() {
    this.modalCtrl.dismiss({ confirmed: false });
  }
}