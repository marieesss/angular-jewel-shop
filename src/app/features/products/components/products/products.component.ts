import { Component, OnInit, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product, ProductType } from '../../models/product.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { RouterModule } from '@angular/router';
import { FilterByTypePipe } from '../../../../shared/pipes/jewel-filter.pipe';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ButtonComponent, RouterModule, FilterByTypePipe, FormsModule],
  template: `
    <div class="p-6">
      <div class="text-center py-8">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Jewels</h2>

        <select class="border border-gray-300 rounded px-3 py-2" [(ngModel)]="selectedType">
          <option value="all">Tous</option>
          <option value="ring">Bagues</option>
          <option value="necklace">Colliers</option>
          <option value="bracelet">Bracelets</option>
          <option value="earring">Boucles d'oreilles</option>
        </select>
      </div>

      @if (loading()) {
        <div class="text-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <p class="mt-2 text-gray-600">jewels loading...</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (
            product of productService.productsSignal() | filterByType: selectedType;
            track product.id
          ) {
            <div
              class="bg-white shadow rounded-lg p-4 flex flex-col items-center text-center outline outline-purple-300 "
            >
              <img
                [src]="product.imageUrl"
                alt="{{ product.name }}"
                class="w-32 h-32 object-cover rounded-md mb-4"
              />
              <h3 class="text-lg font-semibold text-gray-900">
                {{ product.name }}
              </h3>
              <p class="text-gray-800 font-bold">{{ product.price }} €</p>
              <p class="text-sm text-gray-500">Type : {{ product.type }}</p>

              <!-- Actions -->
              <div class="flex gap-2 mt-4">
                <a [routerLink]="[product.id]">
                  <app-button variant="primary" size="sm">Voir</app-button>
                </a>
              </div>
            </div>
          }
        </div>

        @if (productService.productsSignal().length === 0) {
          <p class="text-center text-gray-600 mt-6">No products.</p>
        }
      }
    </div>
  `,
})
export class ProductListComponent implements OnInit {
  productService = inject(ProductService);
  loading = signal(true);
  products = signal<Product[]>([]);
  selectedType: ProductType | 'all' = 'all';

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    try {
      this.loading.set(true);
      const productsListe = await this.productService.getAllProducts();
      this.products.set(productsListe);
    } finally {
      this.loading.set(false);
    }
  }
}
