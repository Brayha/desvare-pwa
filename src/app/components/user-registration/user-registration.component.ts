import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MercadoLibre2Service } from '../../services/mercado-libre2.service';

interface Vehicle {
  icon: string;
  name: string;
  description: string;
  type: string;
}

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [MercadoLibre2Service]
})
export class UserRegistrationComponent implements OnInit {
  @Input() selectedVehicle: Vehicle = {} as Vehicle;
  marcas: string[] = [];
  modelos: string[] = [];
  filteredMarcas: string[] = [];
  filteredModelos: string[] = [];
  loading = false;
  error = '';
  marcaSeleccionada: string = '';
  modeloSeleccionado: string = '';
  searchTerm: string = '';
  placa: string = '';
  currentStep: 'vehicle-selection' | 'personal-info' = 'vehicle-selection';
  personalInfoForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private mlService: MercadoLibre2Service,
    private formBuilder: FormBuilder
  ) {
    this.personalInfoForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit() {
    this.cargarMarcas();
  }

  finalizarRegistro() {
    if (this.personalInfoForm.valid) {
      const userData = {
        ...this.personalInfoForm.value,
        vehicle: {
          ...this.selectedVehicle,
          marca: this.marcaSeleccionada,
          modelo: this.modeloSeleccionado,
          placa: this.placa
        }
      };

      // Aquí iría la lógica para enviar los datos al backend
      console.log('Usuario registrado:', userData);

      // Generar un ID de usuario provisional
      const provisionalUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      
      // Almacenar los datos del usuario en el localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        id: provisionalUserId,
        ...userData
      }));

      this.dismissModal();
    }
  }

  getTitleForCurrentStep(): string {
    return this.currentStep === 'vehicle-selection' ? 'Selecciona tu vehículo' : 'Finaliza tu registro';
  }

  cargarMarcas() {
    this.loading = true;
    this.error = '';
    this.marcas = [];

    this.mlService.getMarcas(this.selectedVehicle.type)
      .subscribe({
        next: (marcas) => {
          this.marcas = marcas;
          this.filteredMarcas = [...this.marcas];
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar las marcas. Por favor, intenta de nuevo.';
          this.loading = false;
          console.error('Error:', err);
        }
      });
  }

  filterMarcas() {
    this.filteredMarcas = this.marcas.filter(marca => 
      marca.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectMarca(marca: string) {
    this.marcaSeleccionada = marca;
    this.cargarModelos();
  }

  backToMarcas() {
    this.marcaSeleccionada = '';
    this.modeloSeleccionado = '';
    this.searchTerm = '';
    this.filterMarcas();
  }

  cargarModelos() {
    this.loading = true;
    this.error = '';
    this.modelos = [];

    this.mlService.getModelos(this.selectedVehicle.type, this.marcaSeleccionada)
      .subscribe({
        next: (modelos) => {
          this.modelos = modelos;
          this.filteredModelos = [...this.modelos];
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los modelos. Por favor, intenta de nuevo.';
          this.loading = false;
          console.error('Error:', err);
        }
      });
  }

  filterModelos() {
    this.filteredModelos = this.modelos.filter(modelo => 
      modelo.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectModelo(modelo: string) {
    this.modeloSeleccionado = modelo;
    this.searchTerm = ''; // Limpiar el término de búsqueda
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  registerUser() {
    if (!this.placa) {
      this.error = 'Por favor, ingrese la placa del vehículo.';
      return;
    }

    // En lugar de cerrar el modal, cambiamos al siguiente paso
    this.currentStep = 'personal-info';
    
    // Limpiamos el error si existía
    this.error = '';
  }

  canDismiss = async (data?: any, role?: string) => {
    return role !== 'gesture';
  };
}