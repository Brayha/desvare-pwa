import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private authService: AuthService
  ) { }

  showOtp: boolean = false;
  logeado: boolean = false;
  segmentValue: string = 'register';
  phoneNumber: string = '';
  phoneError: string = '';
  otpCode: string = '';
  otpError: string = '';

  vehicles = [
    { name: 'Motocicleta', description: 'Vehículos de 2 ruedas', icon: '/assets/icon-vehicle-type/Moto.svg' },
    { name: 'Automóvil', description: 'Vehículos de 2 y 4 puertas', icon: '/assets/icon-vehicle-type/Automovil.svg' },
    { name: 'Camioneta', description: 'De platón y cajón', icon: '/assets/icon-vehicle-type/Camioneta.svg' },
    { name: 'Camión', description: 'Furgón o estacas', icon: '/assets/icon-vehicle-type/Camion.svg' },
    { name: 'Autobus', description: 'Transporte urbano e intermunicipal', icon: '/assets/icon-vehicle-type/Autobus.svg' },
    { name: 'Otra carga', description: 'Trasteos, maquinaria, etc...', icon: '/assets/icon-vehicle-type/Otra.svg' }
  ];

  ngOnInit() {
    this.logeado = this.authService.checkLoginStatus();
  }

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

  validatePhoneNumber() {
    // Eliminar espacios y caracteres no numéricos
    const cleanNumber = this.phoneNumber.replace(/\D/g, '');
    
    // Validar que sea un número colombiano (10 dígitos comenzando con 3)
    if (cleanNumber.length !== 10 || !cleanNumber.startsWith('3')) {
      this.phoneError = 'Por favor, ingrese un número de celular colombiano válido.';
      return false;
    }
    
    this.phoneError = '';
    return true;
  }

  async onSubmit() {
    if (this.validatePhoneNumber()) {
      // Aquí simularemos la verificación del número en la base de datos
      const exists = await this.authService.checkPhoneExists(this.phoneNumber);
      if (exists) {
        this.showOtp = true;
      } else {
        this.phoneError = 'Este número no está registrado en nuestra base de datos.';
      }
    }
  }

  async validateOtp() {
    if (this.otpCode.length !== 6) {
      this.otpError = 'El código debe tener 6 dígitos.';
      return;
    }

    const isValid = await this.authService.verifyOtp(this.phoneNumber, this.otpCode);
    if (isValid) {
      this.authService.login(this.phoneNumber);
      this.logeado = true;
      this.showOtp = false;
      // Aquí podrías cerrar el modal o redirigir al usuario
    } else {
      this.otpError = 'Código inválido. Por favor, intente de nuevo.';
    }
  }

  cerrarSesion() {
    this.authService.logout();
    this.logeado = false;
  }


}