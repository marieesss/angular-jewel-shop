export type OrderStatus = 'cart' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  status: OrderStatus;
  userId: number;
  totalPrice: number;
}
