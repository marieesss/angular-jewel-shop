import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../../products/services/product.service';
import { EnrichedOrder, OrderStatus } from '../../models/order.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">User Orders</h2>

      @if (enrichedOrders().length > 0) {
        <div>
          @if (enrichedOrders().length === 0) {
            <p class="text-gray-600">Aucune commande trouvée.</p>
          } @else {
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="text-left p-2">Date</th>
                  <th class="text-left p-2">Utilisateur</th>
                  <th class="text-left p-2">Email</th>
                  <th class="text-center p-2">Produits</th>
                  <th class="text-right p-2">Prix</th>
                  <th class="text-right p-2">Status</th>
                  <th class="text-right p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                @for (item of enrichedOrders(); track item.id) {
                  <tr class="border-b">
                    <td class="p-2">{{ item.createdAt | date: 'short' }}</td>
                    <td class="p-2">{{ item.user?.name }}</td>
                    <td class="p-2">{{ item.user?.email }}</td>
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
                      <select
                        class="border rounded px-2 py-1"
                        [ngModel]="item.status"
                        (ngModelChange)="updateOrderStatus(item.id, $event)"
                      >
                        <option *ngFor="let s of orderStatuses" [ngValue]="s">{{ s }}</option>
                      </select>
                    </td>
                    <td class="p-2 text-right">
                      <button
                        (click)="deleteOrder(item.id)"
                        class="text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
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
export class AdminOrdersComponent {
  orderService = inject(OrderService);
  productService = inject(ProductService);
  userService = inject(AuthService);
  enrichedOrders = signal<EnrichedOrder[]>([]);

  orderStatuses: OrderStatus[] = ['pending', 'shipped', 'delivered', 'cancelled'];

  constructor() {
    effect(async () => {
      const allOrders = this.orderService.orders();

      await Promise.all(
        allOrders.map(async order => ({
          ...order,
          user: await this.userService.getUserById(order.userId),
          items: await Promise.all(
            order.items.map(async i => ({
              ...i,
              product: await this.productService.getProductById(i.productId),
            }))
          ),
        }))
      ).then(enriched => {
        console.log(enriched);
        this.enrichedOrders.set(enriched);
      });
    });
  }

  updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    this.orderService.updateOrderStatus(orderId, newStatus);
  }

  deleteOrder(orderId: number) {
    this.orderService.deleteOrder(orderId);
  }
}
