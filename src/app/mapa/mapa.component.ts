/// <reference types="@types/google.maps" />

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'] 
})
export class MapaComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  private map!: google.maps.Map;
  private userMarker!: google.maps.Marker;

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    const defaultLocation = { lat: 4.710989, lng: -74.072092 }; // Bogotá
    const mapOptions: google.maps.MapOptions = {
      center: defaultLocation,
      zoom: 16
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    this.getUserLocation();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.map.setCenter(pos);
          this.addUserMarker(pos);
        },
        () => {
          this.handleLocationError(true);
        }
      );
    } else {
      this.handleLocationError(false);
    }
  }

  addUserMarker(position: google.maps.LatLngLiteral) {
    if (this.userMarker) {
      this.userMarker.setMap(null);
    }
    this.userMarker = new google.maps.Marker({
      position: position,
      map: this.map,
      title: 'Tu ubicación'
    });
  }

  handleLocationError(browserHasGeolocation: boolean) {
    console.warn(browserHasGeolocation ?
      'Error: El servicio de geolocalización falló.' :
      'Error: Tu navegador no soporta geolocalización.');
  }
}