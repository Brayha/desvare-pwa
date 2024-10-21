import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-drivers',
  templateUrl: './search-drivers.page.html',
  styleUrls: ['./search-drivers.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel]
})
export class SearchDriversPage implements OnInit {
  userData: any;
  vehicleData: any;
  origen: any;
  destino: any;
  problemData: any;

  constructor(private router: Router) {
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
}