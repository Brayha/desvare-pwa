import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
})
export class UserRegistrationComponent implements OnInit {
  @Input() selectedVehicle: Vehicle = {} as Vehicle;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

  registerUser() {
    // Aquí iría la lógica para registrar al usuario
    console.log('Usuario registrado con vehículo:', this.selectedVehicle);
    this.dismissModal();
  }

  canDismiss = async (data?: any, role?: string) => {
    return role !== 'gesture';
  };
}