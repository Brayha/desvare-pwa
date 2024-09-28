import { Component, OnInit, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicModule, ModalController, IonInput } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-address',
  templateUrl: './modal-address.component.html',
  styleUrls: ['./modal-address.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ModalAddressComponent implements OnInit {
  @Input() origen: string = '';
  @Input() destinoActual: string = '';
  destino: string = '';
  @ViewChild('destinoInput', { static: false }) destinoInput!: IonInput;
  @ViewChild('origenInput', { static: false }) origenInput!: IonInput;

  private autocompleteService: google.maps.places.AutocompleteService;
  private placesService: google.maps.places.PlacesService;
  sugerenciasDestino: google.maps.places.AutocompletePrediction[] = [];
  sugerenciasOrigen: google.maps.places.AutocompletePrediction[] = [];
  private searchSubjectDestino: Subject<string> = new Subject<string>();
  private searchSubjectOrigen: Subject<string> = new Subject<string>();

  private colombiaBounds: google.maps.LatLngBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-4.2316872, -82.1243666),
    new google.maps.LatLng(13.3805948, -66.8511907)
  );

  sugerenciasIniciales: string[] = [
    'Parque Simón Bolívar',
    'Centro Comercial Andino',
    'Aeropuerto El Dorado',
    'Universidad Nacional de Colombia',
    'Monserrate'
  ];

  constructor(private modalCtrl: ModalController, private ngZone: NgZone) {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  ngOnInit() {
    if (this.destinoActual) {
      this.destino = this.destinoActual;
    }
    this.searchSubjectDestino.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((query: string) => {
      this.buscarLugares(query, 'destino');
    });
    this.searchSubjectOrigen.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((query: string) => {
      this.buscarLugares(query, 'origen');
    });
    this.mostrarSugerenciasIniciales();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.destinoInput.setFocus();
    }, 150);
  }

  mostrarSugerenciasIniciales() {
    this.sugerenciasDestino = this.sugerenciasIniciales.map(sugerencia => ({
      description: sugerencia,
      structured_formatting: {
        main_text: sugerencia,
        secondary_text: 'Sugerencia'
      }
    } as google.maps.places.AutocompletePrediction));
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  limpiarInput(tipo: 'origen' | 'destino') {
    if (tipo === 'origen') {
      this.origen = '';
      this.sugerenciasOrigen = [];
    } else {
      this.destino = '';
      this.mostrarSugerenciasIniciales();
    }
  }

  onSearchChangeDestino(event: any) {
    const query = event.detail.value;
    if (query) {
      this.searchSubjectDestino.next(query);
    } else {
      this.mostrarSugerenciasIniciales();
    }
  }

  onSearchChangeOrigen(event: any) {
    const query = event.detail.value;
    if (query) {
      this.searchSubjectOrigen.next(query);
    } else {
      this.sugerenciasOrigen = [];
    }
  }

  private buscarLugares(query: string, tipo: 'origen' | 'destino') {
    if (query && query.length > 0) {
      const request: google.maps.places.AutocompletionRequest = {
        input: query,
        bounds: this.colombiaBounds,
        componentRestrictions: { country: 'CO' },
        types: ['geocode', 'establishment']
      };

      this.autocompleteService.getPlacePredictions(request, (predictions, status) => {
        this.ngZone.run(() => {
          if (tipo === 'destino') {
            this.sugerenciasDestino = status === google.maps.places.PlacesServiceStatus.OK ? predictions || [] : [];
          } else {
            this.sugerenciasOrigen = status === google.maps.places.PlacesServiceStatus.OK ? predictions || [] : [];
          }
        });
      });
    } else {
      if (tipo === 'destino') {
        this.mostrarSugerenciasIniciales();
      } else {
        this.sugerenciasOrigen = [];
      }
    }
  }

  seleccionarLugar(place: google.maps.places.AutocompletePrediction, tipo: 'origen' | 'destino') {
    this.placesService.getDetails({ placeId: place.place_id }, (result, status) => {
      this.ngZone.run(() => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result && result.formatted_address) {
          const direccionSeleccionada = {
            direccion: result.formatted_address,
            lat: result.geometry?.location?.lat() ?? 0,
            lng: result.geometry?.location?.lng() ?? 0
          };
          if (tipo === 'destino') {
            this.destino = direccionSeleccionada.direccion;
            this.sugerenciasDestino = [];
          } else {
            this.origen = direccionSeleccionada.direccion;
            this.sugerenciasOrigen = [];
          }
          this.modalCtrl.dismiss({
            origen: this.origen,
            destino: this.destino,
            origenLat: tipo === 'origen' ? direccionSeleccionada.lat : undefined,
            origenLng: tipo === 'origen' ? direccionSeleccionada.lng : undefined,
            destinoLat: tipo === 'destino' ? direccionSeleccionada.lat : undefined,
            destinoLng: tipo === 'destino' ? direccionSeleccionada.lng : undefined
          });
        }
      });
    });
  }

  confirmarDirecciones() {
    this.modalCtrl.dismiss({
      origen: this.origen,
      destino: this.destino
    });
  }
}