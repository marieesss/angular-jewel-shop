import { Product } from '../../features/products/models/product.model';
import { FilterByTypePipe } from './jewel-filter.pipe';

describe('FilterByTypePipe', () => {
  let pipe: FilterByTypePipe;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Elegant Ring',
      description: 'Test',
      price: 120,
      quantity: 5,
      imageUrl: 'assets/1.png',
      createdAt: new Date(),
      type: 'ring',
    },
    {
      id: 2,
      name: 'Collier perles',
      description: 'Test',
      price: 250,
      quantity: 3,
      imageUrl: 'assets/2.png',
      createdAt: new Date(),
      type: 'necklace',
    },
    {
      id: 3,
      name: 'Bracelet or',
      description: 'Test',
      price: 300,
      quantity: 2,
      imageUrl: 'assets/3.png',
      createdAt: new Date(),
      type: 'bracelet',
    },
  ];

  beforeEach(() => {
    pipe = new FilterByTypePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array if no product is ring', () => {
    expect(pipe.transform([], 'ring')).toEqual([]);
  });

  it('should return all products if we want all products', () => {
    const result = pipe.transform(mockProducts, 'all');
    expect(result.length).toBe(3);
  });

  it('should filter products that are ring type', () => {
    const result = pipe.transform(mockProducts, 'ring');
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('ring');
  });

  it('should filter products that are necklace type', () => {
    const result = pipe.transform(mockProducts, 'necklace');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Collier perles');
  });

  it('should filter products that are earring type', () => {
    const result = pipe.transform(mockProducts, 'earring');
    expect(result.length).toBe(0);
  });
});
