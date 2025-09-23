import { Product } from '../../features/products/models/product.model';
import { TotalPricePipe } from './price.pipe';

describe('TotalPricePipe', () => {
  let pipe: TotalPricePipe;

  beforeEach(() => {
    pipe = new TotalPricePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 0 if quantity is 0', () => {
    const product: Product = {
      id: 1,
      name: 'Ring',
      description: 'A simple ring',
      price: 100,
      quantity: 10,
      imageUrl: 'ring.png',
      createdAt: new Date(),
      type: 'ring',
    };
    const result = pipe.transform(product, 0);
    expect(result).toBe(0);
  });

  it('should calculate total price correctly', () => {
    const product: Product = {
      id: 2,
      name: 'Necklace',
      description: 'Test',
      price: 50,
      quantity: 5,
      imageUrl: 'necklace.png',
      createdAt: new Date(),
      type: 'necklace',
    };
    const result = pipe.transform(product, 3);
    expect(result).toBe(150);
  });

  it('should handle decimal prices correctly', () => {
    const product: Product = {
      id: 3,
      name: 'Bracelet',
      description: 'Test',
      price: 19.99,
      quantity: 5,
      imageUrl: 'bracelet.png',
      createdAt: new Date(),
      type: 'bracelet',
    };
    const result = pipe.transform(product, 2);
    expect(result).toBeCloseTo(39.98, 2);
  });
});
