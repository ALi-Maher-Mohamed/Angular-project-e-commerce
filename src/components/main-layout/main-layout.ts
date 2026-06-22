import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { MessageService } from '../../services/message.service';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  isDark = false;
  isLoggedIn = false;
  isAdmin = false;

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private favoriteService = inject(FavoriteService);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  readonly messageService = inject(MessageService);

  readonly loading = this.loadingService.loading;
  readonly message = this.messageService.message;
  readonly messageType = this.messageService.type;
  readonly cartCount = computed(() => this.cartService.cartItems().length);
  readonly favoritesCount = computed(() => this.favoriteService.favorites().length);

  constructor() {
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = user !== null;
      this.isAdmin = user?.role === 'Admin';
    });
  }

  toggleDark(): void {
    this.isDark = !this.isDark;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
