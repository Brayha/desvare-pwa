import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-address',
  templateUrl: './modal-address.component.html',
  styleUrls: ['./modal-address.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ModalAddressComponent  implements OnInit {
  @Input() origen: string = '';
  destino: string = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    // Puedes inicializar cualquier dato necesario aquí
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  confirmarDestino() {
    this.modalCtrl.dismiss({
      destino: this.destino
    });
  }

}
