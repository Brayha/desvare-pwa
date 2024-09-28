/// <reference types="@types/google.maps" />

import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { decode } from '@googlemaps/polyline-codec';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @Output() addressChanged = new EventEmitter<string>();
  @Input() destinoSeleccionado: any;

  private map!: google.maps.Map;
  private userMarker!: google.maps.Marker;
  private destinoMarker!: google.maps.Marker;
  private geocoder!: google.maps.Geocoder;
  private directionsService!: google.maps.DirectionsService;
  private directionsRenderer!: google.maps.DirectionsRenderer;

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

  private animatedPolyline: google.maps.Polyline | null = null;

  ngOnInit() {
    this.loadGoogleMaps().then(() => {
      this.initMap();
      this.geocoder = new google.maps.Geocoder();
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#223D62'
        }
      });
      this.directionsRenderer.setMap(this.map);
    }).catch(error => {
      console.error('Error al cargar Google Maps:', error);
    });
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

  private loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&libraries=places`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.onload = () => resolve();
        script.onerror = () => reject('No se pudo cargar Google Maps');
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['destinoSeleccionado'] && !changes['destinoSeleccionado'].firstChange) {
      this.trazarRuta();
    }
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
          this.getAddressFromCoords(pos.lat, pos.lng);
        },
        () => {
          this.handleLocationError(true);
        }
      );
    } else {
      this.handleLocationError(false);
    }
  }

  getAddressFromCoords(lat: number, lng: number) {
    const latlng = new google.maps.LatLng(lat, lng);
    this.geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results && results.length > 0) {
          this.addressChanged.emit(results[0].formatted_address);
        }
      }
    });
  }

  private obtenerPathDelSVG(): string {
    return 'M27.4933 11.2667C26.0933 5.10666 20.72 2.33333 16 2.33333C16 2.33333 16 2.33333 15.9867 2.33333C11.28 2.33333 5.89333 5.09333 4.49333 11.2533C2.93333 18.1333 7.14667 23.96 10.96 27.6267C12.3733 28.9867 14.1867 29.6667 16 29.6667C17.8133 29.6667 19.6267 28.9867 21.0267 27.6267C24.84 23.96 29.0533 18.1467 27.4933 11.2667ZM16 17.9467C13.68 17.9467 11.8 16.0667 11.8 13.7467C11.8 11.4267 13.68 9.54666 16 9.54666C18.32 9.54666 20.2 11.4267 20.2 13.7467C20.2 16.0667 18.32 17.9467 16 17.9467Z';
  }

  addUserMarker(position: google.maps.LatLngLiteral) {
    if (this.userMarker) {
      this.userMarker.setMap(null);
    }

    const svgPath = this.obtenerPathDelSVG();

    const icon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
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

  addDestinoMarker(position: google.maps.LatLng) {
    if (this.destinoMarker) {
      this.destinoMarker.setMap(null);
    }

    const svgPath = this.obtenerPathDelSVG();

    const icon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path fill="#FF5500" d="${svgPath}" />
      </svg>
    `)}`,
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 32),
    };

    this.destinoMarker = new google.maps.Marker({
      position: position,
      map: this.map,
      title: 'Destino',
      icon: icon,
    });
  }

  trazarRuta() {
    if (!this.destinoSeleccionado || !this.userMarker) return;

    const destino = new google.maps.LatLng(this.destinoSeleccionado.lat, this.destinoSeleccionado.lng);

    // Añadir el marcador de destino
    this.addDestinoMarker(destino);

    const request: google.maps.DirectionsRequest = {
      origin: this.userMarker.getPosition() as google.maps.LatLng,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result, status) => {
      if (status === 'OK' && result) {
        // No renderizamos la ruta con directionsRenderer
        // this.directionsRenderer.setDirections(result);

        // En su lugar, solo animamos la ruta
        this.animateRoute(result);
      } else {
        console.error('No se pudo trazar la ruta:', status);
      }
    });
  }

  private animateRoute(result: google.maps.DirectionsResult) {
    const route = result.routes[0].overview_polyline;
    const decodedPath = decode(route);
  
    if (this.animatedPolyline) {
      this.animatedPolyline.setMap(null);
    }
  
    this.animatedPolyline = new google.maps.Polyline({
      path: [],
      geodesic: true,
      strokeColor: '#223D62',
      strokeOpacity: 0.8,
      strokeWeight: 5,
      map: this.map
    });
  
    let index = 0;
    const step = 3; // Aumenta este valor para una animación más rápida
    const animationStep = () => {
      if (index < decodedPath.length) {
        const segment = decodedPath.slice(0, index + 1);
        this.animatedPolyline!.setPath(segment.map(point => ({ lat: point[0], lng: point[1] })));
        index += step; // Incrementamos el índice por el valor de step en cada iteración
        requestAnimationFrame(animationStep);
      } else {
        // Cuando la animación termina, dibujamos la ruta completa
        this.animatedPolyline!.setPath(decodedPath.map(point => ({ lat: point[0], lng: point[1] })));
      }
    };
  
    animationStep();
  
    // Ajustar el mapa para que muestre toda la ruta
    const bounds = new google.maps.LatLngBounds();
    result.routes[0].overview_path.forEach((point) => bounds.extend(point));
    this.map.fitBounds(bounds);
  }
}
