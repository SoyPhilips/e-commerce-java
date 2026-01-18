import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService } from './services/product.service';
import { Producto } from './models/producto.model';
import { CartService } from './services/cart.service';
import { WishlistService } from './services/wishlist.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, LucideAngularModule],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('imageEntrance', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9) translateX(-20px)' }),
        animate('600ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1) translateX(0)' }))
      ])
    ])
  ],
  template: `
    @if (product()) {
      <div class="detail-container">
        <header class="detail-header" @fadeInUp>
          <button mat-button routerLink="/tienda" class="back-btn">
            <lucide-icon name="arrow-left" class="icon-sm"></lucide-icon>
            Volver a la tienda
          </button>
        </header>

        <div class="product-grid">
          <!-- Galería de Imágenes -->
          <div class="image-section" @imageEntrance>
            <div class="main-image">
              <img [src]="product()?.imagenUrl" [alt]="product()?.nombre">
            </div>
          </div>

          <!-- Información del Producto -->
          <div class="info-section" @fadeInUp>
            <span class="category-tag">{{ product()?.categoria }}</span>
            <h1 class="product-title">{{ product()?.nombre }}</h1>
            
            <div class="rating-row">
              <div class="stars">
                @for (i of [1,2,3,4,5]; track i) {
                  <lucide-icon name="star" class="star-icon" [class.filled]="i <= 4"></lucide-icon>
                }
              </div>
              <span class="reviews-count">(124 Reseñas)</span>
            </div>

            <div class="price-box">
              <span class="price">{{ product()?.precio | currency }}</span>
              <span class="stock-status" [class.low]="(product()?.stock ?? 0) < 5">
                {{ (product()?.stock ?? 0) > 0 ? 'En Stock' : 'Agotado' }}
              </span>
            </div>

            <p class="description">{{ product()?.descripcion }}</p>

            <div class="actions-grid">
              <div class="quantity-selector">
                <button mat-icon-button (click)="decrementQuantity()" [disabled]="quantity() <= 1">
                  <lucide-icon name="minus" class="icon-sm"></lucide-icon>
                </button>
                <span class="quantity">{{ quantity() }}</span>
                <button mat-icon-button (click)="incrementQuantity()" [disabled]="quantity() >= (product()?.stock ?? 0)">
                  <lucide-icon name="plus" class="icon-sm"></lucide-icon>
                </button>
              </div>

              <button 
                mat-raised-button 
                color="primary" 
                class="add-btn" 
                (click)="addToCart()"
                [disabled]="(product()?.stock ?? 0) === 0">
                <lucide-icon name="shopping-cart" class="icon-sm"></lucide-icon>
                Añadir al Carrito
              </button>

              <button 
                mat-stroked-button 
                class="wishlist-btn"
                [class.active]="wishlistService.isInWishlist(product()?.id!)"
                (click)="wishlistService.toggleWishlist(product()!)">
                <lucide-icon name="heart" [class.filled]="wishlistService.isInWishlist(product()?.id!)"></lucide-icon>
              </button>
            </div>

            <div class="features-list">
              <div class="feature">
                <lucide-icon name="truck" class="feature-icon"></lucide-icon>
                <div>
                  <strong>Envío Gratis</strong>
                  <p>En pedidos superiores a $500</p>
                </div>
              </div>
              <div class="feature">
                <lucide-icon name="shield-check" class="feature-icon"></lucide-icon>
                <div>
                  <strong>Garantía Oficial</strong>
                  <p>12 meses de cobertura total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .detail-container { padding: 40px 0; max-width: 1100px; margin: 0 auto; }
    
    .detail-header { margin-bottom: 32px; }
    .back-btn { font-weight: 600 !important; color: #64748b !important; }

    .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }

    /* Imagen */
    .image-section { background: white; border-radius: 32px; padding: 40px; border: 1px solid #e2e8f0; }
    .main-image { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; }
    .main-image img { width: 100%; height: 100%; object-fit: contain; }

    /* Info */
    .category-tag { background: #f5f3ff; color: #6366f1; padding: 6px 16px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; display: inline-block; }
    .product-title { font-size: 2.5rem; font-weight: 800; color: #1e293b; margin: 0 0 16px; line-height: 1.1; }

    .rating-row { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .stars { display: flex; gap: 4px; color: #f59e0b; }
    .star-icon { width: 18px; height: 18px; }
    .star-icon.filled { fill: currentColor; }
    .reviews-count { color: #64748b; font-size: 0.9rem; font-weight: 500; }

    .price-box { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
    .price { font-size: 2rem; font-weight: 800; color: #6366f1; }
    .stock-status { font-size: 0.85rem; font-weight: 700; padding: 4px 12px; border-radius: 12px; background: #f0fdf4; color: #16a34a; }
    .stock-status.low { background: #fef2f2; color: #ef4444; }

    .description { font-size: 1.1rem; line-height: 1.6; color: #64748b; margin-bottom: 40px; }

    /* Acciones */
    .actions-grid { display: grid; grid-template-columns: auto 1fr auto; gap: 16px; margin-bottom: 40px; }
    
    .quantity-selector { display: flex; align-items: center; background: #f8fafc; border-radius: 16px; padding: 4px; border: 1px solid #e2e8f0; }
    .quantity { width: 40px; text-align: center; font-weight: 700; font-size: 1.1rem; }
    
    .add-btn { height: 56px !important; border-radius: 16px !important; font-weight: 700 !important; font-size: 1rem !important; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3) !important; }
    
    .wishlist-btn { width: 56px; height: 56px !important; border-radius: 16px !important; color: #94a3b8 !important; }
    .wishlist-btn.active { color: #ef4444 !important; border-color: #ef4444 !important; }
    .wishlist-btn .filled { fill: currentColor; }

    /* Features */
    .features-list { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding-top: 40px; border-top: 1px solid #f1f5f9; }
    .feature { display: flex; gap: 16px; align-items: flex-start; }
    .feature-icon { color: #6366f1; width: 24px; height: 24px; }
    .feature div strong { display: block; font-size: 0.95rem; color: #1e293b; margin-bottom: 2px; }
    .feature div p { font-size: 0.85rem; color: #64748b; margin: 0; }

    @media (max-width: 900px) {
      .product-grid { grid-template-columns: 1fr; gap: 40px; }
      .product-title { font-size: 2rem; }
    }
  `]
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  public cartService = inject(CartService);
  public wishlistService = inject(WishlistService);

  product = signal<Producto | null>(null);
  quantity = signal(1);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe((p: Producto) => this.product.set(p));
  }

  incrementQuantity() {
    if (this.quantity() < (this.product()?.stock ?? 0)) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart() {
    if (this.product()) {
      for (let i = 0; i < this.quantity(); i++) {
        this.cartService.addToCart(this.product()!);
      }
    }
  }
}
