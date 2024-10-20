import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-service-modal',
  templateUrl: './confirm-service-modal.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ConfirmServiceModalComponent {
  @Input() userData: any;
  @Input() vehicleData: any;
  @Input() origen: any;
  @Input() destino: any;

  constructor(private modalCtrl: ModalController) {}

  confirmar() {
    this.modalCtrl.dismiss({ confirmed: true });
  }

  cancelar() {
    this.modalCtrl.dismiss({ confirmed: false });
  }
}