import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalAddressComponent } from '../modal-address/modal-address.component';
import { MapaComponent } from '../mapa/mapa.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, MapaComponent, ModalAddressComponent]
})
export class Tab2Page {
  constructor(private modalCtrl: ModalController) { }

  async abrirModalDestino() {
    const modal = await this.modalCtrl.create({
      component: ModalAddressComponent,
      componentProps: {
        origen: 'Mi ubicación actual' // Puedes cambiar esto por la ubicación real
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log('Destino seleccionado:', data.destino);
      // Aquí puedes manejar el destino seleccionado
    }
  }
}