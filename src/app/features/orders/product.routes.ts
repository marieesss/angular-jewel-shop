import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';

export const ORDER_ROUTE: Routes = [
  {
    path: 'cart',
    component: CartComponent,
  },

  {
    path: '',
    redirectTo: 'cart',
    pathMatch: 'full',
  },
];
