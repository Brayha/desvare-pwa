import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserRegistrationComponent } from '../user-registration/user-registration.component';

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
    { name: 'Motocicleta', description: 'Vehículos de 2 ruedas', icon: '/assets/icon-vehicle-type/Moto.svg' },
    { name: 'Automóvil', description: 'Vehículos de 2 y 4 puertas', icon: '/assets/icon-vehicle-type/Automovil.svg' },
    { name: 'Camioneta', description: 'De platón y cajón', icon: '/assets/icon-vehicle-type/Camioneta.svg' },
    { name: 'Camión', description: 'Furgón o estacas', icon: '/assets/icon-vehicle-type/Camion.svg' },
    { name: 'Autobus', description: 'Transporte urbano e intermunicipal', icon: '/assets/icon-vehicle-type/Autobus.svg' },
    { name: 'Otra carga', description: 'Trasteos, maquinaria, etc...', icon: '/assets/icon-vehicle-type/Otra.svg' }
  ];

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.logeado = this.authService.checkLoginStatus();
    if (this.logeado) {
      this.loadSavedVehicles();
      this.loadUserName();
    }
  }

  async openRegistrationModal(vehicle: any) {
    const modal = await this.modalController.create({
      component: UserRegistrationComponent,
      componentProps: {
        selectedVehicle: vehicle
      }
    });
    return await modal.present();
  }

  // Métodos de carga de datos de usuario
  async loadSavedVehicles() {
    try {
      // TODO: Implementar llamada al servicio para obtener vehículos guardados
      /* this.savedVehicles = await this.authService.getSavedVehicles(); */
      this.savedVehicles = [
        { brand: 'Ford', model: 'Explorer', plate: 'ZIV-026', icon: 'assets/brand.png' }
      ];
    } catch (error) {
      console.error('Error al cargar los vehículos guardados:', error);
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
        console.error('Error al verificar el número de teléfono:', error);
        this.phoneError = 'Ocurrió un error al verificar el número. Por favor, intente de nuevo.';
      } finally {
        this.isLoading = false;
      }
    }
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