import { Routes } from '@angular/router';
import { ProductListComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-details/product-detail.component';

export const PRODUCT_ROUTE: Routes = [
  {
    path: '',
    component: ProductListComponent,
  },
  {
    path: ':id',
    component: ProductDetailComponent,
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];
