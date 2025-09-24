import { User } from '../../auth/models/user.model';
import { Product } from '../../products/models/product.model';

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

export interface EnrichedOrder extends Order {
  user?: User | null;
  items: (OrderItem & { product: Product | null })[];
}
