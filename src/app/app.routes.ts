import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: '',
    redirectTo: 'tabs/tab2',
    pathMatch: 'full',
  },
  {
    path: 'prueba-mercado',
    loadComponent: () => import('./prueba-mercado/prueba-mercado.page').then( m => m.PruebaMercadoPage)
  },
  {
    path: 'service-detail',
    loadComponent: () => import('./service-detail/service-detail.page').then( m => m.ServiceDetailPage)
  }
];