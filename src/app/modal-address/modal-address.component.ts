import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IonicModule, ModalController, IonInput } from '@ionic/angular';
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
  @ViewChild('destinoInput', { static: false }) destinoInput!: IonInput;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    // Puedes inicializar cualquier dato necesario aquí
  }

  ionViewDidEnter() {
    // Esto se ejecutará cuando la vista del modal se haya cargado completamente
    setTimeout(() => {
      this.destinoInput.setFocus();
    }, 150);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
