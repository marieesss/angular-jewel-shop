import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../../products/services/product.service';
import { EnrichedOrder } from '../../models/order.model';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Mes Commandes</h2>

      @if (enrichedOrders.length > 0) {
        <div>
          @if (enrichedOrders.length === 0) {
            <p class="text-gray-600">Aucune commande trouvée.</p>
          } @else {
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="text-left p-2">Date</th>
                  <th class="text-center p-2">Produits</th>
                  <th class="text-right p-2">Prix</th>
                  <th class="text-right p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                @for (item of enrichedOrders; track item.id) {
                  <tr class="border-b">
                    <td class="p-2">{{ item.createdAt | date: 'short' }}</td>
                    <td class="p-2 text-center">
                      @for (subItem of item.items; track subItem.productId) {
                        <div class="flex items-center justify-center gap-2 mb-1">
                          <img
                            [src]="subItem.product?.imageUrl"
                            class="w-8 h-8 object-cover rounded"
                            alt="{{ subItem.product?.name }}"
                          />
                          <span>{{ subItem.product?.name }} (x{{ subItem.quantity }})</span>
                        </div>
                      }
                    </td>
                    <td class="p-2 text-right">{{ item.totalPrice | number: '1.2-2' }} €</td>
                    <td class="p-2 text-right">
                      {{ item.status }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      } @else {
        <p class="text-gray-600">Aucune commande trouvée.</p>
      }
    </div>
  `,
})
export class UserOrdersComponent implements OnInit {
  orderService = inject(OrderService);
  productService = inject(ProductService);
  enrichedOrders: EnrichedOrder[] = [];

  // Utile pour charger les images des produits dans les commandes passées sans reload infini
  ngOnInit() {
    this.init();
  }

  async init() {
    this.enrichedOrders = await Promise.all(
      this.orderService.myPastOrders().map(async order => ({
        ...order,
        items: await Promise.all(
          order.items.map(async i => ({
            ...i,
            product: await this.productService.getProductById(i.productId),
          }))
        ),
      }))
    );
  }
}
