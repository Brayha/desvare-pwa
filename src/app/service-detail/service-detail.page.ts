import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal, ModalController } from '@ionic/angular';
import { MapaComponent } from '../mapa/mapa.component';
import { Router } from '@angular/router';


interface FormField {
  type: 'textarea' | 'toggle' | 'select' | 'segment';
  label: string;
  name: string;
  options?: string[];
}

interface Problem {
  id: string;
  title: string;
  description: string;
  formFields: FormField[];
}

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.page.html',
  styleUrls: ['./service-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, MapaComponent]
})
export class ServiceDetailPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  userInfo: any;
  vehicleInfo: any;
  origen: any;
  destino: any;

  problems: Problem[] = [
    { 
      id: 'estrellado', 
      title: 'Estoy estrellado', 
      description: 'El vehículo se encuentra estrellado',
      formFields: [
        { type: 'textarea', label: 'Describe el problema', name: 'descripcion' },
        { type: 'toggle', label: '¿Las ruedas del vehículo giran y ruedan con normalidad?', name: 'ruedasNormales' }
      ]
    },
    { 
      id: 'sotano', 
      title: 'Estoy en un sótano', 
      description: 'El vehículo se encuentra en un sótano y no puede salir',
      formFields: [
        { type: 'select', label: '¿En qué nivel de sótano está?', name: 'nivelSotano', options: ['1', '2', '3', '4', '5+'] }
      ]
    },
    { 
      id: 'fallas', 
      title: 'Fallas mecánicas o eléctricas', 
      description: 'El vehículo no prende o no funciona',
      formFields: [
        { type: 'textarea', label: 'Describe el problema', name: 'descripcionFalla' }
      ]
    },
    { 
      id: 'descachado', 
      title: 'Descachado', 
      description: 'Cogí un hueco o estoy encunetado y no puedo salir',
      formFields: [
        { type: 'toggle', label: '¿Las ruedas del vehículo giran y ruedan con normalidad?', name: 'ruedasNormales' }
      ]
    },
    { 
      id: 'patios', 
      title: 'Salida de los patios', 
      description: 'Necesito sacar el vehículo de los patios',
      formFields: [
        { type: 'segment', label: 'Tipo de patios', name: 'tipoPatios', options: ['Patios de fiscalía', 'Patios de movilidad'] }
      ]
    },
    { 
      id: 'otro', 
      title: 'Otro', 
      description: 'Tengo un problema más complejo',
      formFields: [
        { type: 'textarea', label: 'Describe el problema', name: 'descripcionOtro' }
      ]
    }
  ];

  showList: boolean = false;
  selectedProblem: string | null = null;
  message = 'Este es el contenido del modal';
  name: string = '';
  destinoSeleccionado: any = { lat: 4.710989, lng: -74.072092 }; // Ejemplo de destino
  isModalOpen = true;
  formData: {[key: string]: any} = {};

  constructor(
    private router: Router,
    private modalController: ModalController
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.userInfo = navigation.extras.state['userInfo'];
      this.vehicleInfo = navigation.extras.state['vehicleInfo'];
      this.origen = navigation.extras.state['origen'];
      this.destino = navigation.extras.state['destino'];
    }
  }

  ngOnInit() {
    console.log('User Info:', this.userInfo);
    console.log('Vehicle Info:', this.vehicleInfo);
    console.log('Origen:', this.origen);
    console.log('Destino:', this.destino);

    // Cerrar cualquier modal abierto
    this.modalController.getTop().then(modal => {
      if (modal) {
        modal.dismiss();
      }
    });

    // Inicializar el formulario con los datos del usuario y vehículo
    this.initializeFormData();
  }

  initializeFormData() {
    if (this.userInfo && this.vehicleInfo) {
      this.formData = {
        ...this.userInfo,
        ...this.vehicleInfo
      };
    }
  }

  selectProblem(problemId: string) {
    this.selectedProblem = problemId;
    this.showList = true;
    this.formData = {}; // Reinicia los datos del formulario
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.isModalOpen = false;
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
    this.isModalOpen = false;
  }

  obtenerTituloProblema(): string {
    return this.problems.find(p => p.id === this.selectedProblem)?.title || '';
  }
  
  obtenerCamposFormulario(): any[] {
    return this.problems.find(p => p.id === this.selectedProblem)?.formFields || [];
  }

  onWillDismiss(event: any) {
    if (event.detail.role === 'confirm') {
      this.message = `Hola, ${event.detail.data}!`;
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  buscarGrua() {
    console.log('Datos del servicio:', {
      usuario: this.userInfo,
      vehiculo: this.vehicleInfo,
      origen: this.origen,
      destino: this.destino,
      problema: this.selectedProblem,
      detallesProblema: this.formData
    });
    // Aquí iría la lógica para buscar la grúa
  }
}