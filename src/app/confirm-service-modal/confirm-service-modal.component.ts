import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-confirm-service-modal',
  templateUrl: './confirm-service-modal.component.html',
  styleUrls: ['./confirm-service-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ConfirmServiceModalComponent {
  @Input() userData: any;
  @Input() vehicleData: any;
  @Input() origen: any;
  @Input() destino: any;
  selectedProblem: any = null;

  problemList = [
    {
      title: 'Estoy estrellado o encunetado',
      questions: [
        {
          type: 'text',
          label: '¿Qué le sucede al vehículo?',
          placeholder: 'Describe el problema',
          icon: 'assets/iconsax-svg/All/bulk/message.svg'
        },
        {
          type: 'toggle',
          label: 'Las ruedas del vehículo ruedan y giran con dificultad'
        },
        {
          type: 'select',
          label: 'Gravedad del daño',
          placeholder: 'Seleccione la gravedad',
          options: ['Leve', 'Moderado', 'Grave']
        }
      ]
    },
    {
      title: 'Falla mecanica o eléctrica',
      questions: [
        {
          type: 'text',
          label: '¿Qué le sucede al vehículo?',
          placeholder: 'Describe el problema',
          icon: 'assets/iconsax-svg/All/bulk/message.svg'
        }
      ]
    },
    {
      title: 'Sacar vehiculo de los patios',
      questions: [
        {
          type: 'select',
          label: '¿Que tipo de patio es?',
          placeholder: 'Seleccione una opción',
          options: ['Patios de fiscalia', 'Patios de movilidad',]
        }
      ]
    },
    {
      title: 'Está en un sotano y no puede salir',
      questions: [
        {
          type: 'select',
          label: '¿Que nivel de profundidad es?',
          placeholder: 'Seleccione una opción',
          options: ['1', '2', '3', '4', '+5']
        }
      ]
    },
    {
      title: 'Otro',
      questions: [
        {
          type: 'text',
          label: '¿Qué le sucede al vehículo?',
          placeholder: 'Describe el problema',
          icon: 'assets/iconsax-svg/All/bulk/message.svg'
        },
      ]
    },
    // ... Definir otros problemas con sus preguntas específicas
  ];

  constructor(
    private modalCtrl: ModalController,
    private router: Router
  ) { }

  selectProblem(problem: any) {
    this.selectedProblem = problem;
  }

  goBack() {
    this.selectedProblem = null;
  }

  async confirmarServicio() {
    console.log('Servicio confirmado', this.selectedProblem);
    await this.modalCtrl.dismiss({ confirmed: true, problemData: this.selectedProblem });
    this.router.navigate(['/search-drivers'], {
      state: {
        userData: this.userData,
        vehicleData: this.vehicleData,
        origen: this.origen,
        destino: this.destino,
        problemData: this.selectedProblem
      }
    });
  }

  cancelar() {
    this.modalCtrl.dismiss({ confirmed: false });
  }
}