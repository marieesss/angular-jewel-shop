import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../../products/services/product.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { TotalPricePipe } from '../../../../shared/pipes/price.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, TotalPricePipe],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Mon Panier</h2>

      @if (orderService.currentOrder()) {
        <div>
          @if (orderService.currentOrder()?.items?.length === 0) {
            <p class="text-gray-600">Votre panier est vide.</p>
          } @else {
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="text-left p-2">Produit</th>
                  <th class="text-center p-2">Quantité</th>
                  <th class="text-right p-2">Prix</th>
                  <th class="text-right p-2">Total</th>
                  <th class="text-right p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (item of orderService.currentOrder()?.items; track item.productId) {
                  <tr class="border-b">
                    <td class="p-2">{{ productName(item.productId) }}</td>
                    <td class="p-2 text-center">
                      <span>{{ item.quantity }}</span>
                    </td>
                    <td class="p-2 text-right">{{ productPrice(item.productId) }} €</td>
                    <td class="p-2 text-right">
                      {{ productPrice(item.productId) * item.quantity | number: '1.2-2' }} €
                    </td>
                    <td class="p-2 text-right">
                      <app-button variant="primary" size="sm" (click)="remove(item.productId)"
                        >Supprimer</app-button
                      >
                    </td>
                  </tr>
                }
              </tbody>
            </table>

            <div class="flex justify-end mt-6">
              <div class="text-right">
                <p class="text-lg font-bold">
                  Total : {{ orderService.currentOrder()?.totalPrice | number: '1.2-2' }} €
                </p>
                <app-button variant="primary" size="lg" (click)="checkout()"
                  >Valider la commande</app-button
                >
              </div>
            </div>
          }
        </div>
      } @else {
        <p class="text-gray-600">Aucun panier trouvé.</p>
      }
    </div>
  `,
})
export class CartComponent {
  orderService = inject(OrderService);
  productService = inject(ProductService);

  productName(productId: number): string {
    const product = this.productService.productsSignal().find(p => p.id === productId);
    return product ? product.name : 'Inconnu';
  }

  productPrice(productId: number): number {
    const product = this.productService.productsSignal().find(p => p.id === productId);
    return product ? product.price : 0;
  }

  remove(productId: number) {
    this.orderService.removeProduct(productId);
  }

  checkout() {
    this.orderService.checkout();
  }
}
