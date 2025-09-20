import { Pipe, PipeTransform } from '@angular/core';
import { Product, ProductType } from '../../features/products/models/product.model';
@Pipe({
  name: 'filterByType',
  standalone: true,
})
export class FilterByTypePipe implements PipeTransform {
  transform(products: Product[] | null, type: ProductType | 'all'): Product[] {
    if (!products) return [];
    if (!type || type === 'all') return products;
    return products.filter(p => p.type === type);
  }
}
