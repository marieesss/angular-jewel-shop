import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../../features/orders/models/order.model';

@Pipe({
  name: 'cartCount',
  standalone: true,
})
export class CartCountPipe implements PipeTransform {
  transform(order: Order | null): number {
    if (!order || !order.items) return 0;
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
