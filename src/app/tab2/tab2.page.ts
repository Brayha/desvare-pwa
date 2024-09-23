import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MapaComponent } from '../mapa/mapa.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, MapaComponent]
})
export class Tab2Page {
  constructor() {}
}