import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, ChildrenOutletContexts } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { filter } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { LucideAngularModule } from 'lucide-angular';
import { CartService } from './services/cart.service';
import { WishlistService } from './services/wishlist.service';
import { ThemeService } from './services/theme.service';
import { NotificationService } from './services/notification.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatBadgeModule, MatIconModule, LucideAngularModule],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            opacity: 0,
            transform: 'translateY(10px)'
          })
        ], { optional: true }),
        query(':enter', [
          animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true }),
      ])
    ]),
    trigger('drawerAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="app-wrapper" [class.dark-mode]="themeService.darkMode()">
      @if (showHeader()) {
        <header class="main-header">
          <div class="container header-content">
            <div class="logo-area" routerLink="/tienda">
              <div class="logo-icon">N</div>
              <div class="logo-text">
                <h1>NovaMarket</h1>
                <span>Premium Marketplace</span>
              </div>
            </div>

            <nav class="nav-links">
              <a routerLink="/tienda" routerLinkActive="active" mat-button>Tienda</a>
              @if (authService.isAdmin()) {
                <a routerLink="/admin" routerLinkActive="active" mat-button>
                  <lucide-icon name="layout-dashboard" class="icon-sm"></lucide-icon>
                  Panel Admin
                </a>
              }
            </nav>

            <div class="header-actions">
              <button class="theme-toggle" (click)="themeService.toggleDarkMode()" [title]="themeService.darkMode() ? 'Modo Claro' : 'Modo Oscuro'" mat-icon-button>
                <lucide-icon [name]="themeService.darkMode() ? 'sun' : 'moon'"></lucide-icon>
              </button>

              <button class="wishlist-trigger" (click)="toggleWishlist()" title="Mis Favoritos" mat-icon-button>
                <div class="icon-badge-wrapper">
                  <lucide-icon name="heart" [class.filled]="wishlistService.count() > 0"></lucide-icon>
                  @if (wishlistService.count() > 0) {
                    <span class="badge">{{ wishlistService.count() }}</span>
                  }
                </div>
              </button>

              <button class="cart-trigger" (click)="toggleCart()" title="Carrito" mat-icon-button>
                <div class="icon-badge-wrapper">
                  <lucide-icon name="shopping-cart"></lucide-icon>
                  @if (cartService.totalItems() > 0) {
                    <span class="badge">{{ cartService.totalItems() }}</span>
                  }
                </div>
              </button>

              <div class="user-area">
                @if (authService.isLoggedIn()) {
                  <div class="user-profile">
                    <div class="avatar">{{ authService.user()?.name?.charAt(0)?.toUpperCase() }}</div>
                    <button class="logout-btn" (click)="logout()" mat-button color="warn">
                      <lucide-icon name="log-out" class="icon-sm"></lucide-icon>
                      Salir
                    </button>
                  </div>
                } @else {
                  <button class="login-btn" routerLink="/login" mat-raised-button color="primary">
                    <lucide-icon name="user" class="icon-sm"></lucide-icon>
                    Entrar
                  </button>
                }
              </div>
            </div>
          </div>
        </header>
      }

      <main class="container" [@routeAnimations]="getRouteAnimationData()">
        <router-outlet></router-outlet>
      </main>

      <!-- Notificación Global -->
      @if (notificationService.show()) {
        <div class="toast-notification" @fadeAnimation>
          <lucide-icon name="check-circle" class="icon-sm"></lucide-icon>
          {{ notificationService.message() }}
        </div>
      }

      <!-- Cart Drawer -->
      @if (isCartOpen()) {
        <div class="cart-overlay" (click)="toggleCart()" @fadeAnimation></div>
        <div class="cart-drawer open" @drawerAnimation>
          <div class="cart-header">
            <h2>
              <lucide-icon name="shopping-cart" class="icon-md"></lucide-icon>
              Tu Carrito
            </h2>
            <button class="close-btn" (click)="toggleCart()" mat-icon-button>×</button>
          </div>
          
          <div class="cart-items">
            @for (item of cartService.items(); track item.id) {
              <div class="cart-item">
                <img [src]="item.imagenUrl" [alt]="item.nombre">
                <div class="item-info">
                  <h4>{{ item.nombre }}</h4>
                  <p>{{ item.precio | currency }} x {{ item.quantity }}</p>
                </div>
                <div class="item-actions">
                  <button class="remove-btn" (click)="cartService.removeFromCart(item.id)" mat-icon-button color="warn">
                    <lucide-icon name="trash-2" class="icon-sm"></lucide-icon>
                  </button>
                </div>
              </div>
            } @empty {
              <div class="empty-cart">
                <lucide-icon name="shopping-cart" class="icon-lg opacity-20"></lucide-icon>
                <p>Tu carrito está vacío</p>
                <button (click)="toggleCart()" routerLink="/tienda" mat-raised-button color="primary">Ir a comprar</button>
              </div>
            }
          </div>

          @if (cartService.totalItems() > 0) {
            <div class="cart-footer">
              <div class="total">
                <span>Total:</span>
                <span>{{ cartService.totalPrice() | currency }}</span>
              </div>
              <button class="checkout-btn" routerLink="/checkout" (click)="isCartOpen.set(false)" mat-raised-button color="primary">
                Finalizar Compra
                <lucide-icon name="arrow-right" class="icon-sm"></lucide-icon>
              </button>
            </div>
          }
        </div>
      }

      <!-- Wishlist Drawer -->
      @if (isWishlistOpen()) {
        <div class="cart-overlay" (click)="toggleWishlist()" @fadeAnimation></div>
        <div class="cart-drawer open wishlist-drawer" @drawerAnimation>
          <div class="cart-header">
            <h2>
              <lucide-icon name="heart" class="icon-md"></lucide-icon>
              Mis Favoritos
            </h2>
            <button class="close-btn" (click)="toggleWishlist()" mat-icon-button>×</button>
          </div>
          
          <div class="cart-items">
            @for (item of wishlistService.items(); track item.id) {
              <div class="cart-item">
                <img [src]="item.imagenUrl" [alt]="item.nombre">
                <div class="item-info">
                  <h4>{{ item.nombre }}</h4>
                  <p>{{ item.precio | currency }}</p>
                </div>
                <div class="item-actions">
                  <button class="add-btn-mini" (click)="cartService.addToCart(item); wishlistService.toggleWishlist(item)" title="Pasar al carrito" mat-mini-fab color="primary">
                    <lucide-icon name="shopping-cart" class="icon-sm"></lucide-icon>
                  </button>
                  <button class="remove-btn" (click)="wishlistService.toggleWishlist(item)" mat-icon-button color="warn">
                    <lucide-icon name="trash-2" class="icon-sm"></lucide-icon>
                  </button>
                </div>
              </div>
            } @empty {
              <div class="empty-cart">
                <lucide-icon name="heart" class="icon-lg opacity-20"></lucide-icon>
                <p>No tienes productos favoritos</p>
                <button (click)="toggleWishlist()" routerLink="/tienda" mat-raised-button color="primary">Explorar tienda</button>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .app-wrapper { min-height: 100vh; background: #f8fafc; color: #1e293b; transition: background 0.3s, color 0.3s; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

    /* Header */
    .main-header { background: white; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 100; padding: 12px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .header-content { display: flex; justify-content: space-between; align-items: center; }
    
    .logo-area { display: flex; align-items: center; gap: 12px; cursor: pointer; }
    .logo-icon { background: #6366f1; color: white; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.5rem; }
    .logo-text h1 { font-size: 1.25rem; font-weight: 800; margin: 0; line-height: 1; color: #1e293b; }
    .logo-text span { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

    .nav-links { display: flex; gap: 8px; margin-left: 40px; flex: 1; }
    .nav-links a { font-weight: 600 !important; color: #64748b !important; }
    .nav-links a.active { color: #6366f1 !important; background: #f5f3ff !important; }

    .header-actions { display: flex; align-items: center; gap: 12px; }
    
    .icon-badge-wrapper { position: relative; display: flex; align-items: center; justify-content: center; }
    .badge { position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; font-size: 0.65rem; font-weight: 700; padding: 2px 6px; border-radius: 20px; border: 2px solid white; line-height: 1; }

    .user-profile { display: flex; align-items: center; gap: 12px; padding-left: 12px; border-left: 1px solid #e2e8f0; }
    .avatar { width: 36px; height: 36px; background: #6366f1; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }

    /* Toast */
    .toast-notification {
      position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
      background: #1e293b; color: white; padding: 12px 24px; border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 9999; display: flex; align-items: center; gap: 10px;
      font-weight: 600;
    }

    /* Cart Drawer Styles */
    .cart-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); z-index: 1000; backdrop-filter: blur(4px); }
    .cart-drawer { position: fixed; top: 0; right: 0; width: 400px; height: 100%; background: white; z-index: 1001; box-shadow: -10px 0 30px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
    
    .cart-header { padding: 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .cart-header h2 { margin: 0; font-size: 1.25rem; font-weight: 700; display: flex; align-items: center; gap: 12px; color: #1e293b; }
    .close-btn { color: #64748b !important; }
    
    .cart-items { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
    .cart-item { display: flex; gap: 16px; align-items: center; background: #f8fafc; padding: 16px; border-radius: 20px; border: 1px solid #e2e8f0; }
    .cart-item img { width: 64px; height: 64px; object-fit: cover; border-radius: 12px; background: white; }
    .item-info { flex: 1; }
    .item-info h4 { margin: 0; font-size: 0.95rem; font-weight: 700; color: #1e293b; }
    .item-info p { margin: 4px 0 0; color: #6366f1; font-weight: 700; font-size: 0.9rem; }
    
    .item-actions { display: flex; gap: 4px; }

    .cart-footer { padding: 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
    .total { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 1.25rem; font-weight: 800; color: #1e293b; }
    .checkout-btn { width: 100%; height: 54px !important; border-radius: 14px !important; font-weight: 700 !important; font-size: 1rem !important; }
    
    .empty-cart { text-align: center; padding: 60px 20px; color: #64748b; }
    .empty-cart p { margin: 16px 0 24px; font-weight: 500; }
    .opacity-20 { opacity: 0.2; }
    .icon-lg { width: 64px; height: 64px; margin: 0 auto; }
    .icon-md { width: 24px; height: 24px; }
    .icon-sm { width: 18px; height: 18px; }

    @media (max-width: 450px) {
      .cart-drawer { width: 100%; }
    }
  `],
})
export class App {
  public cartService = inject(CartService);
  public wishlistService = inject(WishlistService);
  public themeService = inject(ThemeService);
  public notificationService = inject(NotificationService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private contexts = inject(ChildrenOutletContexts);
  
  isCartOpen = signal(false);
  isWishlistOpen = signal(false);
  currentUrl = signal('');

  showHeader = computed(() => {
    return this.currentUrl() !== '/login' && this.currentUrl() !== '/';
  });

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl.set(event.urlAfterRedirects);
    });
    
    this.currentUrl.set(this.router.url);
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  logout() {
    this.isCartOpen.set(false);
    this.authService.logout();
    this.cartService.clearCart();
    this.router.navigate(['/login']);
    this.notificationService.showNotification('Has cerrado sesión correctamente');
  }

  toggleCart() {
    this.isCartOpen.update(v => !v);
    this.isWishlistOpen.set(false);
  }

  toggleWishlist() {
    this.isWishlistOpen.update(v => !v);
    this.isCartOpen.set(false);
  }
}
