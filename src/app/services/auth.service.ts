import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;

  constructor() {
    // Simular la verificación de un token almacenado
    this.isLoggedIn = !!localStorage.getItem('user_token');
  }

  checkLoginStatus(): boolean {
    return this.isLoggedIn;
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('user_token');
  }

  async checkPhoneExists(phoneNumber: string): Promise<boolean> {
    // Aquí simularemos una verificación en la base de datos
    // En un escenario real, esto sería una llamada a la API
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulamos que los números que terminan en pares existen
        resolve(parseInt(phoneNumber.slice(-1)) % 2 === 0);
      }, 1000);
    });
  }

  async verifyOtp(phoneNumber: string, otpCode: string): Promise<boolean> {
    // Simulación de verificación OTP
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulamos que el código '123456' es válido
        resolve(otpCode === '123456');
      }, 1000);
    });
  }

  login(phoneNumber: string): void {
    this.isLoggedIn = true;
    localStorage.setItem('user_token', 'dummy_token');
    localStorage.setItem('user_phone', phoneNumber);
  }
}