import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../features/products/models/product.model';
@Pipe({
  name: 'totalPrice',
  standalone: true,
})
export class TotalPricePipe implements PipeTransform {
  transform(product: Product | null, quantity: number): number {
    if (!product) return 0;
    return product.price * quantity;
  }
}
