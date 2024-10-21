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

  swiperConfig = {
    pagination: false,
    spaceBetween: 10,
    breakpoints: {
      // cuando el ancho de la ventana es >= 320px
      320: {
        slidesPerView: 1.5,
        spaceBetween: 10
      },
      // cuando el ancho de la ventana es >= 480px
      480: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      // cuando el ancho de la ventana es >= 640px
      640: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  };

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