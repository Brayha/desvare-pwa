import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private toastController: ToastController) {}

  async handleError(error: any, friendlyMessage: string) {
    console.error('Error:', error);
    
    const toast = await this.toastController.create({
      message: friendlyMessage,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    toast.present();
  }
}