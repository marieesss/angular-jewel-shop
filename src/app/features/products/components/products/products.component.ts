import { Component, OnInit, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  template: `
    <div class="p-6">
      <div class="text-center py-8">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Jewels</h2>
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
          @for (product of productService.productsSignal(); track product.id) {
            <div
              class="bg-white shadow rounded-lg p-4 flex flex-col items-center text-center outline outline-purple-300 hover:outline-purple-200"
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
                <button
                  class="px-3 py-1 bg-pink-500 text-white text-sm rounded hover:bg-purple-600"
                  (click)="viewProduct(product.id)"
                >
                  Voir
                </button>
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

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    try {
      this.loading.set(true);
      const productsListe = await this.productService.getAllProducts();
      this.products.set(productsListe);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      this.loading.set(false);
    }
  }

  viewProduct(id: number) {
    console.log('produit', id);
  }
}
