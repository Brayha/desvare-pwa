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
  destino: string = '';
  @ViewChild('destinoInput', { static: false }) destinoInput!: IonInput;

  private autocompleteService: google.maps.places.AutocompleteService;
  private placesService: google.maps.places.PlacesService;
  sugerencias: google.maps.places.AutocompletePrediction[] = [];
  private searchSubject: Subject<string> = new Subject<string>();

  // Definimos los límites de Colombia
  private colombiaBounds: google.maps.LatLngBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-4.2316872, -82.1243666), // Esquina suroeste
    new google.maps.LatLng(13.3805948, -66.8511907)  // Esquina noreste
  );

  constructor(private modalCtrl: ModalController, private ngZone: NgZone) {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((query: string) => {
      this.buscarLugares(query);
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.destinoInput.setFocus();
    }, 150);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onSearchChange(event: any) {
    const query = event.detail.value;
    if (query) {
      this.searchSubject.next(query);
    } else {
      this.sugerencias = [];
    }
  }

  private buscarLugares(query: string) {
    if (query && query.length > 0) {
      const request: google.maps.places.AutocompletionRequest = {
        input: query,
        bounds: this.colombiaBounds,
        componentRestrictions: { country: 'CO' },
        types: ['geocode', 'establishment']
      };

      this.autocompleteService.getPlacePredictions(request, (predictions, status) => {
        this.ngZone.run(() => {
          this.sugerencias = status === google.maps.places.PlacesServiceStatus.OK ? predictions || [] : [];
        });
      });
    } else {
      this.sugerencias = [];
    }
  }

  seleccionarLugar(place: google.maps.places.AutocompletePrediction) {
    this.placesService.getDetails({ placeId: place.place_id }, (result, status) => {
      this.ngZone.run(() => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          const direccionSeleccionada = {
            direccion: result.formatted_address,
            lat: result.geometry?.location?.lat(),
            lng: result.geometry?.location?.lng()
          };
          this.modalCtrl.dismiss(direccionSeleccionada);
        }
      });
    });
  }
}