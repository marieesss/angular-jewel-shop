import { Routes } from '@angular/router';
import { ProductListComponent } from './components/products/products.component';

export const PRODUCT_ROUTE: Routes = [
  {
    path: '',
    component: ProductListComponent,
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];
