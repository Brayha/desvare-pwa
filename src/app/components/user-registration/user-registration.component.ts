import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MercadoLibreService, Brand } from '../../services/mercado-libre.service';

interface Vehicle {
  icon: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [MercadoLibreService] // Añadida esta línea
})
export class UserRegistrationComponent implements OnInit {
  @Input() selectedVehicle: Vehicle = {} as Vehicle;
  brands: Brand[] = [];
  loading = false;
  error = '';

  constructor(
    private modalController: ModalController,
    private mlService: MercadoLibreService
  ) { }

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.loading = true;
    this.error = '';
    this.brands = [];

    this.mlService.getVehicleBrands('MCO1763') // Usamos el ID de motos
      .subscribe({
        next: (brands) => {
          this.brands = brands;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar las marcas. Por favor, intenta de nuevo.';
          this.loading = false;
          console.error('Error:', err);
        }
      });
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  registerUser() {
    console.log('Usuario registrado con vehículo:', this.selectedVehicle);
    this.dismissModal();
  }

  canDismiss = async (data?: any, role?: string) => {
    return role !== 'gesture';
  };
}