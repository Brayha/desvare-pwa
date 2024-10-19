import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-service-modal',
  templateUrl: './confirm-service-modal.component.html',
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