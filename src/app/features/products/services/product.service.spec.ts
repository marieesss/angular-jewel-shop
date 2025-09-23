import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with mocked products if localStorage is empty', async () => {
    const products = await service.getAllProducts();
    expect(products.length).toBe(2);
    expect(products[0].name).toBe('Elegant Ring');
  });

  it('should get product by id', async () => {
    const product = await service.getProductById(1);
    expect(product).not.toBeNull();
    expect(product?.id).toBe(1);

    const notFound = await service.getProductById(999);
    expect(notFound).toBeNull();
  });

  it('should update a product and persist changes', async () => {
    const products = await service.getAllProducts();
    const product = { ...products[0], price: 150 };

    await service.updateProduct(product);

    const updated = await service.getProductById(product.id);
    expect(updated?.price).toBe(150);

    const saved = JSON.parse(localStorage.getItem('products')!);
    expect(saved.find((p: Product) => p.id === product.id).price).toBe(150);
  });

  it('should update productsSignal when saving', async () => {
    const product = {
      id: 1,
      name: 'Elegant Ring',
      description: 'Bague en argent avec pierre précieuse.',
      price: 200,
      quantity: 4,
      imageUrl: 'assets/1.png',
      createdAt: new Date(),
      type: 'bracelet' as const,
    };

    await service.updateProduct(product);

    const signalValue = service.productsSignal();
    expect(signalValue.find(p => p.id === 1)?.price).toBe(200);
  });
});
