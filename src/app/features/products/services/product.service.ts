import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private PRODUCTS_KEY = 'products';
  private products: Product[] = [];

  public productsSignal = signal<Product[]>([]);

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private mockedProducts: Product[] = [
    {
      id: 1,
      name: 'Elegant Ring',
      description: 'Bague en argent avec pierre précieuse.',
      price: 120,
      quantity: 5,
      imageUrl: 'assets/1.png',
      createdAt: new Date(),
      type: 'ring',
    },
    {
      id: 2,
      name: 'Collier perles',
      description: 'Collier raffiné en perles naturelles.',
      price: 250,
      quantity: 3,
      imageUrl: 'assets/2.png',
      createdAt: new Date(),
      type: 'necklace',
    },
  ];

  constructor() {
    const savedProducts = localStorage.getItem(this.PRODUCTS_KEY);
    if (savedProducts) {
      this.products = JSON.parse(savedProducts);
    } else {
      this.products = [...this.mockedProducts];
      this.saveProducts();
    }
    this.productsSignal.set(this.products);
  }

  private saveProducts(): void {
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(this.products));
    this.productsSignal.set(this.products);
  }

  async getAllProducts(): Promise<Product[]> {
    await this.delay(300);
    return this.products;
  }

  getProductById(id: number): Observable<Product> {
    const product = this.products.find(p => p.id === id);
    return product
      ? of(product).pipe(delay(300))
      : throwError(() => new Error('Produit non trouvé'));
  }
}
