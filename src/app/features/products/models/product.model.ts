export type ProductType = 'ring' | 'necklace' | 'bracelet' | 'earring';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  createdAt: Date;
  type: ProductType;
}
