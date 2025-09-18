import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';

export const PRODUCT_ROUTE: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];
