import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { TotalPricePipe } from '../../../../shared/pipes/price.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterLink, TotalPricePipe],
  template: `
    <div>
      <a routerLink="/">
        <app-button variant="secondary" size="sm">Retour</app-button>
      </a>
      <div class="p-6 max-w-3xl mx-auto">
        @if (loading()) {
          <div class="flex justify-center items-center py-12">
            <div class="animate-spin h-8 w-8 border-b-2 border-pink-600 rounded-full"></div>
          </div>
        } @else if (product()) {
          <div class="bg-white shadow-lg rounded-lg p-6">
            <img
              [src]="product()?.imageUrl"
              alt="{{ product()?.name }}"
              class="w-64 h-64 object-cover rounded-md mx-auto mb-6"
            />
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              {{ product()?.name }}
            </h2>
            <p class="text-gray-600 mb-4">{{ product()?.description }}</p>

            <div class="grid grid-cols-2 gap-4 text-gray-800 mb-6">
              <div><span class="font-semibold">Prix :</span> {{ product()?.price }} €</div>
              <div><span class="font-semibold">Type :</span> {{ product()?.type }}</div>
              <div>
                <span class="font-semibold">Ajouté le :</span>
                {{ product()?.createdAt | date: 'short' }}
              </div>
            </div>

            <div class="flex  gap-4 mb-6">
              <app-button variant="primary" size="sm" (clicked)="decreaseQuantity()">-</app-button>
              <span class="text-lg font-semibold">{{ quantity() }}</span>
              <app-button variant="primary" size="sm" (clicked)="increaseQuantity()">+</app-button>

              <div class="ml-4 flex items-center">
                <span class="text-sm text-gray-500">
                  Total : {{ product() | totalPrice: quantity() | number: '1.2-2' }} €
                </span>
              </div>
            </div>

            <div class="flex gap-4">
              <app-button variant="primary" size="lg">Ajouter au panier</app-button>
            </div>
          </div>
        } @else {
          <p class="text-center text-gray-600 mt-10">Produit introuvable.</p>
        }
      </div>
    </div>
  `,
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);

  product = signal<Product | null>(null);
  loading = signal(true);
  quantity = signal(1);

  ngOnInit() {
    this.loadProduct();
  }

  async loadProduct() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/products']);
      return;
    }

    try {
      this.loading.set(true);
      const prod = await this.productService.getProductById(id);
      this.product.set(prod);
    } finally {
      this.loading.set(false);
    }
  }

  decreaseQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  increaseQuantity() {
    const stock = this.product()?.quantity ?? 1;
    if (this.quantity() < stock) {
      this.quantity.update(q => q + 1);
    }
  }
}
