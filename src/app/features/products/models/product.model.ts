export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  createdAt: Date;
  type: 'ring' | 'necklace' | 'bracelet' | 'earring';
}
