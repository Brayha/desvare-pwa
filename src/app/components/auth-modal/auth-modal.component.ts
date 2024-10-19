import { Component, OnInit, Input } from '@angular/core';
import { MercadoLibre2Service } from '../../services/mercado-libre2.service';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserRegistrationComponent } from '../user-registration/user-registration.component';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms {{delay}} ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { params: { delay: '0ms' } })
    ])
  ]
})
export class AuthModalComponent implements OnInit {
  @Input() origen: any;
  @Input() destino: any;
  categoriasVehiculos: any[] = [];
  // Propiedades de autenticación
  showOtp: boolean = false;
  logeado: boolean = false;
  segmentValue: string = 'register';
  phoneNumber: string = '';
  phoneError: string = '';
  otpCode: string = '';
  otpError: string = '';
  isLoading: boolean = false;

  // Propiedades de usuario y vehículos
  nombreUsuario: string = '';
  savedVehicles: any[] = [];

  // Lista de tipos de vehículos disponibles

  vehicles = [
    { icon: '/assets/icon-vehicle-type/Moto.svg', name: 'Motocicleta', description: 'Hasta 500cc', type: 'motocicleta' },
    { icon: '/assets/icon-vehicle-type/Automovil.svg', name: 'Automóvil', description: 'Sedán, hatchback', type: 'automovil' },
    { icon: '/assets/icon-vehicle-type/Camioneta.svg', name: 'Camioneta', description: 'SUV, pickup', type: 'camioneta' },
    { icon: '/assets/icon-vehicle-type/Camion.svg', name: 'Camión', description: 'Carga pesada', type: 'camion' },
    { icon: '/assets/icon-vehicle-type/Autobus.svg', name: 'Bus', description: 'Transporte público', type: 'bus' }
  ];


  constructor(
    private mercadoLibre2Service: MercadoLibre2Service,
    private modalController: ModalController,
    private authService: AuthService,
    private toastController: ToastController,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCategorias();
    this.logeado = this.authService.checkLoginStatus();
    if (this.logeado) {
      this.loadSavedVehicles();
      this.loadUserName();
    }
  }

  async loadUserData() {
    await this.loadSavedVehicles();
    await this.loadUserName();
  }

  loadCategorias() {
    this.mercadoLibre2Service.getCategorias().subscribe(
      (categorias) => {
        this.categoriasVehiculos = this.ordenarCategorias(categorias);
      },
      (error) => {
        this.errorHandler.handleError(error, 'Error al cargar categorías. Por favor, intenta de nuevo.');
      }
    );
  }

  async onSubmit() {
    if (this.validatePhoneNumber()) {
      this.isLoading = true;
      try {
        const exists = await this.authService.checkPhoneExists(this.phoneNumber);
        if (exists) {
          this.showOtp = true;
        } else {
          this.phoneError = 'Este número no está registrado en nuestra base de datos.';
        }
      } catch (error) {
        this.errorHandler.handleError(error, 'Ocurrió un error al verificar el número. Por favor, intente de nuevo.');
      } finally {
        this.isLoading = false;
      }
    }
  }

  ordenarCategorias(categorias: any[]): any[] {
    const orden = ['Motos', 'Carros y Camionetas', 'Camiones', 'Otros Vehículos'];
    return categorias.sort((a, b) => orden.indexOf(a.name) - orden.indexOf(b.name));
  }

  getIconForCategory(categoryName: string): string {
    // Aquí puedes definir los iconos para cada categoría
    const iconMap: { [key: string]: string } = {
      'Motos': '/assets/icon-vehicle-type/Moto.svg',
      'Carros y Camionetas': '/assets/icon-vehicle-type/Automovil.svg',
      'Camiones': '/assets/icon-vehicle-type/Camion.svg',
      'Otros Vehículos': '/assets/icon-vehicle-type/Autobus.svg'
    };
    return iconMap[categoryName] || '/assets/icon-vehicle-type/Automovil.svg';
  }

  getDescriptionForCategory(categoryName: string): string {
    // Aquí puedes definir descripciones para cada categoría
    const descriptionMap: { [key: string]: string } = {
      'Motos': 'Servicio para motocicletas',
      'Carros y Camionetas': 'Servicio para automóviles y camionetas',
      'Camiones': 'Servicio para vehículos de carga',
      'Otros Vehículos': 'Servicio para otros tipos de vehículos'
    };
    return descriptionMap[categoryName] || 'Servicio de grúa';
  }

  async openRegistrationModal(categoria: any) {
    const modal = await this.modalController.create({
      component: UserRegistrationComponent,
      componentProps: {
        selectedVehicle: {
          type: categoria.id,
          name: categoria.name,
          icon: this.getIconForCategory(categoria.name),
          description: this.getDescriptionForCategory(categoria.name)
        },
        isAddingNewVehicle: this.logeado,
        origen: this.origen,
        destino: this.destino
      }
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.role === 'registered') {
        this.handleRegisteredUser(result.data);
      } else if (result.role === 'dismiss') {
        // El usuario canceló el registro, no hacemos nada
      }
    });
  
    return await modal.present();
  }

  handleRegisteredUser(userData: any) {
    this.logeado = true;
    this.nombreUsuario = userData.userInfo.username;
    this.savedVehicles = [userData.vehicleInfo];
    
    // Actualizar el estado de autenticación en el servicio
    this.authService.setLoggedInStatus(true);
    
    // Guardar los datos del usuario (esto podría hacerse en el AuthService)
    localStorage.setItem('currentUser', JSON.stringify(userData.userInfo));
    
    this.presentWelcomeToast();
  }
  
  // Métodos de carga de datos de usuario
  async loadSavedVehicles() {
    try {
      // TODO: Implementar llamada al servicio para obtener vehículos guardados
      /* this.savedVehicles = await this.authService.getSavedVehicles(); */
      // Por ahora, inicializamos con un vehículo de ejemplo
      this.savedVehicles = [
        { brand: 'Ford', model: 'Explorer', plate: 'ZIV-026', icon: 'assets/brand.png' }
      ];
    } catch (error) {
      console.error('Error al cargar los vehículos guardados:', error);
      this.errorHandler.handleError(error, 'Error al cargar los vehículos guardados. Por favor, intente de nuevo.');
    }
  }

  async loadUserName() {
    try {
      // TODO: Implementar llamada al servicio para obtener el nombre del usuario
      /* this.nombreUsuario = await this.authService.getUserName(); */
      this.nombreUsuario = 'Jhon Snow';
    } catch (error) {
      console.error('Error al cargar el nombre del usuario:', error);
    }
  }

  // Métodos de interacción con vehículos
  selectVehicle(vehicle: any) {
    // TODO: Implementar lógica para seleccionar un vehículo
    console.log('Vehículo seleccionado:', vehicle);
  }

  // Métodos de autenticación
  validatePhoneNumber(): boolean {
    const cleanNumber = this.phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length !== 10 || !cleanNumber.startsWith('3')) {
      this.phoneError = 'Por favor, ingrese un número de celular válido.';
      return false;
    }
    this.phoneError = '';
    return true;
  }


  async validateOtp() {
    if (this.otpCode.length !== 6) {
      this.otpError = 'El código debe tener 6 dígitos.';
      return;
    }

    this.isLoading = true;
    try {
      const isValid = await this.authService.verifyOtp(this.phoneNumber, this.otpCode);
      if (isValid) {
        await this.authService.login(this.phoneNumber);
        this.logeado = true;
        this.showOtp = false;
        await this.presentWelcomeToast();
        // TODO: Implementar lógica post-login (cerrar modal, redirigir, etc.)
      } else {
        this.otpError = 'Código inválido. Por favor, intente de nuevo.';
      }
    } catch (error) {
      console.error('Error al validar OTP:', error);
      this.otpError = 'Ocurrió un error al validar el código. Por favor, intente de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }

  // Métodos de UI
  dismissModal() {
    this.modalController.dismiss();
  }

  cancelarProceso() {
    this.showOtp = false;
    this.otpCode = '';
    this.otpError = '';
    this.phoneNumber = '';
    this.phoneError = '';
  }

  async presentWelcomeToast() {
    const toast = await this.toastController.create({
      message: 'Bienvenido. Ya puedes pedir un servicio.',
      duration: 3000,
      position: 'bottom',
      cssClass: 'custom-welcome-toast',
      mode: 'ios',
      animated: true,
    });
    toast.present();
  }

  cerrarSesion() {
    this.authService.logout();
    this.logeado = false;
    this.phoneNumber = '';
    this.phoneError = '';
    this.otpCode = '';
    // TODO: Implementar lógica adicional post-logout si es necesario
  }
}