import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { OrderService } from '../../../features/orders/services/order.service';
import { CartCountPipe } from '../../pipes/item-count.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CartCountPipe],
  template: `
    <header class="bg-purple-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Jewels Shop</h1>
        <nav>
          <ul class="flex space-x-4">
            @if (currentUser()) {
              <li><a routerLink="/jewels" class="hover:text-blue-200">Jewels</a></li>
              @if (currentUser()?.role === 'admin') {
                <li><a routerLink="/order/admin" class="hover:text-blue-200">Admin</a></li>
              }
              <li><a routerLink="/order/me" class="hover:text-blue-200">Orders</a></li>
              <li>
                <a routerLink="/order/cart" class="hover:text-blue-200">
                  Cart ({{ currentOrder() | cartCount }})
                </a>
              </li>
              <li><button (click)="logout()" class="hover:text-blue-200">Logout</button></li>
            } @else {
              <li><a routerLink="/auth/login" class="hover:text-blue-200">Login</a></li>
              <li><a routerLink="/auth/register" class="hover:text-blue-200">Register</a></li>
            }
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  currentUser = this.authService.currentUser$;
  currentOrder = this.orderService.currentOrder;

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
