import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal } from '@ionic/angular';
import { MapaComponent } from '../mapa/mapa.component';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.page.html',
  styleUrls: ['./service-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, MapaComponent]
})
export class ServiceDetailPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  message = 'Este es el contenido del modal';
  name: string = '';
  destinoSeleccionado: any = { lat: 4.710989, lng: -74.072092 }; // Ejemplo de destino
  isModalOpen = true;

  constructor() { }

  ngOnInit() {
    // El modal se abrirá automáticamente al iniciar la página
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.isModalOpen = false;
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
    this.isModalOpen = false;
  }

  onWillDismiss(event: any) {
    // No cerramos el modal aquí, solo actualizamos el mensaje si es necesario
    if (event.detail.role === 'confirm') {
      this.message = `Hola, ${event.detail.data}!`;
    }
    // No actualizamos isModalOpen aquí
  }

  openModal() {
    this.isModalOpen = true;
  }
}