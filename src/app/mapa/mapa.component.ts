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

  private mapStyle = [
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "poi",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "transit",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#c9c9c9" }]
    }
  ];

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    const defaultLocation = { lat: 4.710989, lng: -74.072092 }; // Bogotá
    const mapOptions: google.maps.MapOptions = {
      center: defaultLocation,
      zoom: 16,
      disableDefaultUI: true, // Desactiva los controles por defecto
      styles: this.mapStyle
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

  private obtenerPathDelSVG(): string {
    // Este path representa un icono de ubicación más típico
    return 'M27.4933 11.2667C26.0933 5.10666 20.72 2.33333 16 2.33333C16 2.33333 16 2.33333 15.9867 2.33333C11.28 2.33333 5.89333 5.09333 4.49333 11.2533C2.93333 18.1333 7.14667 23.96 10.96 27.6267C12.3733 28.9867 14.1867 29.6667 16 29.6667C17.8133 29.6667 19.6267 28.9867 21.0267 27.6267C24.84 23.96 29.0533 18.1467 27.4933 11.2667ZM16 17.9467C13.68 17.9467 11.8 16.0667 11.8 13.7467C11.8 11.4267 13.68 9.54666 16 9.54666C18.32 9.54666 20.2 11.4267 20.2 13.7467C20.2 16.0667 18.32 17.9467 16 17.9467Z';
  }

  addUserMarker(position: google.maps.LatLngLiteral) {
    if (this.userMarker) {
      this.userMarker.setMap(null);
    }

    const svgPath = this.obtenerPathDelSVG();

    const icon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" idth="32" height="32" viewBox="0 0 32 32" fill="none">
        <path fill="#0055ff" d="${svgPath}" />
      </svg>
    `)}`,
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 32),
    };

    this.userMarker = new google.maps.Marker({
      position: position,
      map: this.map,
      title: 'Tu ubicación',
      icon: icon,
    });
  }

  handleLocationError(browserHasGeolocation: boolean) {
    console.warn(browserHasGeolocation ?
      'Error: El servicio de geolocalización falló.' :
      'Error: Tu navegador no soporta geolocalización.');
  }
}