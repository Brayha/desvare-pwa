import { Component, OnInit, ViewChild, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFabButton, IonList, IonItem, IonLabel, IonProgressBar, IonButton, IonFab, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { MapaComponent } from '../mapa/mapa.component';

// Importa el registro de Swiper
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-search-drivers',
  templateUrl: './search-drivers.page.html',
  styleUrls: ['./search-drivers.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFab, IonFabButton, IonButton, IonProgressBar, IonContent, MapaComponent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Necesario para usar elementos personalizados como swiper
})
export class SearchDriversPage implements OnInit, AfterViewInit {
  @ViewChild(MapaComponent) mapaComponent!: MapaComponent;
  userData: any;
  vehicleData: any;
  origen: any;
  destino: any;
  problemData: any;

  constructor(private router: Router) {
    // Registra Swiper para usar elementos personalizados
    register();

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.userData = navigation.extras.state['userData'];
      this.vehicleData = navigation.extras.state['vehicleData'];
      this.origen = navigation.extras.state['origen'];
      this.destino = navigation.extras.state['destino'];
      this.problemData = navigation.extras.state['problemData'];
    }
  }

  ngOnInit() {
    console.log('Datos recibidos:', this.userData, this.vehicleData, this.origen, this.destino, this.problemData);
  }

  ngAfterViewInit() {
    if (this.origen && this.origen.lat && this.origen.lng) {
      this.mapaComponent.agregarMarcador(this.origen.lat, this.origen.lng, 'Origen');
    }
  }

  cancelar() {
    this.router.navigate(['/tab2']);
  }
}