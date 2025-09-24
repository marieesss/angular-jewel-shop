import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { OrderStatus } from '../../features/orders/models/order.model';
@Directive({
  selector: '[appOrderStatusColor]',
  standalone: true,
})
export class OrderStatusColorDirective implements OnChanges {
  @Input('appOrderStatusColor') status!: OrderStatus;

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['status']) {
      this.changeColor(this.status);
    }
  }

  private changeColor(status: OrderStatus) {
    let color = '';
    switch (status) {
      case 'pending':
        color = 'bg-yellow-100';
        break;
      case 'shipped':
        color = 'bg-blue-100';
        break;
      case 'delivered':
        color = 'bg-green-100';
        break;
      case 'cancelled':
        color = 'bg-red-100';
        break;
    }

    // Remove class
    this.renderer.setAttribute(this.el.nativeElement, 'class', '');
    // Apply new class
    this.renderer.addClass(this.el.nativeElement, color);
  }
}
