import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';

export const ORDER_ROUTE: Routes = [
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'me',
    component: UserOrdersComponent,
  },
  {
    path: '',
    redirectTo: 'cart',
    pathMatch: 'full',
  },
];
