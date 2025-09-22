import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { adminGuard } from '../../core/guards/admin.guard';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';

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
    path: 'admin',
    canActivate: [adminGuard],
    component: AdminOrdersComponent,
  },
  {
    path: '',
    redirectTo: 'cart',
    pathMatch: 'full',
  },
];
