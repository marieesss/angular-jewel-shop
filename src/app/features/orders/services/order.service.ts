import { effect, inject, Injectable, signal } from '@angular/core';
import { Order, OrderStatus } from '../models/order.model';
import { Product } from '../../products/models/product.model';
import { AuthService } from '../../auth/services/auth.service';
import { ProductService } from '../../products/services/product.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private MY_ORDERS_KEY = 'myOrders';
  private ORDERS_KEY = 'orders';
  private myOrders: Order[] = [];
  private authService = inject(AuthService);
  private productService = inject(ProductService);

  public currentOrder = signal<Order | null>(null);
  public orders = signal<Order[]>([]);

  private mockedOrders: Order[] = [
    {
      id: 1,
      createdAt: new Date('2025-09-01T10:00:00'),
      updatedAt: new Date('2025-09-01T10:05:00'),
      status: 'pending',
      userId: 1,
      totalPrice: 370,
      items: [
        {
          productId: 1,
          quantity: 2,
        },
        {
          productId: 2,
          quantity: 1,
        },
      ],
    },
    {
      id: 2,
      createdAt: new Date('2025-09-10T14:30:00'),
      updatedAt: new Date('2025-09-10T14:30:00'),
      status: 'shipped',
      userId: 2,
      totalPrice: 250,
      items: [
        {
          productId: 2,
          quantity: 1,
        },
      ],
    },
  ];

  constructor() {
    effect(() => {
      const user = this.authService.currentUser$();

      this.saveAllOrders(this.mockedOrders);

      if (!user) {
        return;
      }

      const savedOrders = localStorage.getItem(this.MY_ORDERS_KEY);
      if (savedOrders) {
        this.myOrders = JSON.parse(savedOrders);
      } else {
        const myOrders = this.mockedOrders.filter(o => o.userId === user.id);
        this.myOrders = [...myOrders, this.createEmptyCart(user.id)];
        this.saveOrders();
      }

      let cart = this.myOrders.find(o => o.status === 'cart' && o.userId === user.id);
      if (!cart) {
        cart = this.createEmptyCart(user.id);
        this.myOrders.push(cart);
        this.saveOrders();
      }

      this.currentOrder.set(cart);
    });
  }

  createEmptyCart(userId: number): Order {
    return {
      id: this.myOrders.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [],
      status: 'cart',
      userId,
      totalPrice: 0,
    };
  }

  saveOrders(): void {
    localStorage.setItem(this.MY_ORDERS_KEY, JSON.stringify(this.myOrders));
    this.currentOrder.set(this.myOrders.find(o => o.status === 'cart') || null);
  }

  saveAllOrders(orders: Order[]): void {
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    this.orders.set(orders);
  }

  async addProduct(product: Product, quantity = 1): Promise<void> {
    const cart = this.currentOrder();
    if (!cart) return;

    const updatedCart: Order = {
      ...cart,
      items: [...cart.items],
    };

    const existingItem = updatedCart.items.find(i => i.productId === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      updatedCart.items.push({
        productId: product.id,
        quantity,
      });
    }

    await this.updateTotal(updatedCart);

    this.myOrders = this.myOrders.map(o => (o.id === updatedCart.id ? updatedCart : o));

    this.currentOrder.set(updatedCart);

    // Update product stock
    product.quantity -= quantity;
    this.productService.updateProduct(product);

    this.saveOrders();
  }

  async removeProduct(productId: number): Promise<void> {
    const cart = this.currentOrder();
    if (!cart) return;

    const updatedCart: Order = {
      ...cart,
      items: cart.items.filter(i => i.productId !== productId),
    };

    await this.updateTotal(updatedCart);

    this.myOrders = this.myOrders.map(o => (o.id === updatedCart.id ? updatedCart : o));

    this.currentOrder.set(updatedCart);
    this.saveOrders();
  }

  checkout(): void {
    const cart = this.currentOrder();
    if (!cart) return;

    const updatedCart: Order = { ...cart, status: 'pending', updatedAt: new Date() };

    this.myOrders = this.myOrders.map(o => (o.id === updatedCart.id ? updatedCart : o));

    const allOrders = this.orders();
    const updatedAllOrders = [...allOrders.filter(o => o.id !== updatedCart.id), updatedCart];
    this.saveAllOrders(updatedAllOrders);

    const newCart = this.createEmptyCart(this.authService.currentUser$()?.id || 0);
    this.myOrders.push(newCart);

    this.currentOrder.set(newCart);
    this.saveOrders();
  }

  async updateTotal(order: Order): Promise<void> {
    const totals = await Promise.all(
      order.items.map(async item => {
        try {
          const product = await this.productService.getProductById(item.productId);
          return product ? product.price * item.quantity : 0;
        } catch {
          return 0;
        }
      })
    );

    order.totalPrice = totals.reduce((sum, val) => sum + val, 0);
    order.updatedAt = new Date();
  }

  getOrdersByStatus(status: OrderStatus): Order[] {
    return this.myOrders.filter(o => o.status === status);
  }
}
