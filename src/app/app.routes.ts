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
    path: 'search-drivers',
    loadComponent: () => import('./search-drivers/search-drivers.page').then( m => m.SearchDriversPage)
  }
];