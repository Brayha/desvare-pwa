import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private directionsService: google.maps.DirectionsService;
  private directionsRenderer: google.maps.DirectionsRenderer;

  constructor() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
  }

  setMap(map: google.maps.Map) {
    this.directionsRenderer.setMap(map);
  }

  calculateRoute(origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral) {
    this.directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(response);
        } else {
          window.alert('No se pudo calcular la ruta: ' + status);
        }
      }
    );
  }
}