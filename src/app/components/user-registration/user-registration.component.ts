import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MercadoLibre2Service } from '../../services/mercado-libre2.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

interface Vehicle {
  icon: string;
  name: string;
  description: string;
  type: string;
  marca?: string;
  modelo?: string;
  placa?: string;
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
  @Input() isAddingNewVehicle: boolean = false;

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
  placaIngresada: boolean = false;

  constructor(
    private modalController: ModalController,
    private mlService: MercadoLibre2Service,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandlerService
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

  // Métodos de carga de datos
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
          this.errorHandler.handleError(err, 'Error al cargar las marcas. Por favor, intenta de nuevo.');
          this.loading = false;
        }
      });
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
          this.errorHandler.handleError(err, 'Error al cargar los modelos. Por favor, intenta de nuevo.');
          this.loading = false;
        }
      });
  }

  // Métodos de filtrado y selección
  filterMarcas() {
    this.filteredMarcas = this.marcas.filter(marca => 
      marca.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filterModelos() {
    this.filteredModelos = this.modelos.filter(modelo => 
      modelo.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectMarca(marca: string) {
    this.marcaSeleccionada = marca;
    this.modeloSeleccionado = '';
    this.placaIngresada = false;
    this.cargarModelos();
  }

  selectModelo(modelo: string) {
    this.modeloSeleccionado = modelo;
    this.placaIngresada = false;
    this.searchTerm = '';
  }

  ingresarPlaca() {
    this.placaIngresada = true;
  }

  backToMarcas() {
    this.marcaSeleccionada = '';
    this.modeloSeleccionado = '';
    this.placaIngresada = false;
    this.searchTerm = '';
    this.filterMarcas();
  }

  backToModelos() {
    this.modeloSeleccionado = '';
    this.placaIngresada = false;
    this.placa = '';
  }

  backToPlaca() {
    this.currentStep = 'vehicle-selection';
    this.placaIngresada = false;
  }

  // Métodos de registro y finalización
  registerUser() {
    if (!this.placa) {
      this.error = 'Por favor, ingrese la placa del vehículo.';
      return;
    }
    this.placaIngresada = true;
    if (this.isAddingNewVehicle) {
      this.finalizarRegistro();
    } else {
      this.currentStep = 'personal-info';
    }
    this.error = '';
  }

  finalizarRegistro() {
    const vehicleData: Vehicle = {
      ...this.selectedVehicle,
      marca: this.marcaSeleccionada,
      modelo: this.modeloSeleccionado,
      placa: this.placa
    };

    if (this.isAddingNewVehicle) {
      this.addNewVehicle(vehicleData);
    } else if (this.personalInfoForm.valid) {
      this.registerNewUser(vehicleData);
    }
  }

  addNewVehicle(vehicleData: Vehicle) {
    // TODO: Implementar lógica para agregar un nuevo vehículo al usuario actual
    // Por ejemplo: this.userService.addVehicle(vehicleData).subscribe(...)
    console.log('Nuevo vehículo agregado:', vehicleData);
    this.modalController.dismiss(vehicleData);
  }

  registerNewUser(vehicleData: Vehicle) {
    const userData = {
      ...this.personalInfoForm.value,
      vehicle: vehicleData
    };

    // TODO: Implementar lógica para enviar los datos al backend
    console.log('Usuario registrado:', userData);

    // Generar un ID de usuario provisional (esto debería hacerse en el backend)
    const provisionalUserId = 'user_' + Math.random().toString(36).substr(2, 9);
    
    // Almacenar los datos del usuario en el localStorage (temporal, debería manejarse con un servicio de autenticación)
    localStorage.setItem('currentUser', JSON.stringify({
      id: provisionalUserId,
      ...userData
    }));

    this.modalController.dismiss(userData);
  }

  // Métodos de UI
  getTitleForCurrentStep(): string {
    if (this.isAddingNewVehicle) {
      return 'Agregar nuevo vehículo';
    }
    return this.currentStep === 'vehicle-selection' ? 'Selecciona tu vehículo' : 'Finaliza tu registro';
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  canDismiss = async (data?: any, role?: string) => {
    return role !== 'gesture';
  };
}