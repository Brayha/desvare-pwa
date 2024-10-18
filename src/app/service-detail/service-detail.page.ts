import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal } from '@ionic/angular';
import { MapaComponent } from '../mapa/mapa.component';

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

  constructor() { }

  ngOnInit() {
    // El modal se abrirá automáticamente al iniciar la página
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
    console.log('Datos del formulario:', this.formData);
    // Aquí iría la lógica para buscar la grúa
  }
}