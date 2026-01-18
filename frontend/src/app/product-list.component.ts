import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService } from './services/product.service';
import { Producto } from './models/producto.model';
import { CartService } from './services/cart.service';
import { WishlistService } from './services/wishlist.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule, MatIconModule, MatSliderModule, LucideAngularModule],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('50ms', [
            animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('filterAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ],
  template: `
    <div class="shop-container">
      <!-- Sidebar de Filtros -->
      <aside class="filters-sidebar" @filterAnimation>
        <div class="filter-section">
          <h3>Categorías</h3>
          <div class="category-list">
            @for (cat of categories; track cat) {
              <button 
                (click)="selectedCategory.set(cat)"
                [class.active]="selectedCategory() === cat"
                class="category-btn">
                {{ cat }}
              </button>
            }
          </div>
        </div>

        <div class="filter-section">
          <h3>Precio Máximo</h3>
          <div class="price-filter">
            <mat-slider min="0" max="2000" step="50" discrete>
              <input matSliderThumb [(ngModel)]="maxPrice">
            </mat-slider>
            <div class="price-labels">
              <span>$0</span>
              <span>{{ maxPrice() | currency }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Grid de Productos -->
      <div class="main-content">
        <div class="search-bar">
          <lucide-icon name="search" class="search-icon"></lucide-icon>
          <input 
            type="text" 
            [ngModel]="searchQuery()" 
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Buscar productos...">
        </div>

        <div class="products-grid" [@listAnimation]="filteredProducts().length">
          @for (product of filteredProducts(); track product.id) {
            <div class="product-card">
              <div class="card-image" [routerLink]="['/producto', product.id]">
                <img [src]="product.imagenUrl" [alt]="product.nombre">
                <div class="card-overlay">
                  <button mat-flat-button color="primary" class="view-btn">Ver Detalles</button>
                </div>
                <button 
                  class="wishlist-btn" 
                  [class.active]="wishlistService.isInWishlist(product.id)"
                  (click)="$event.stopPropagation(); wishlistService.toggleWishlist(product)"
                  mat-icon-button>
                  <lucide-icon name="heart" [class.filled]="wishlistService.isInWishlist(product.id)"></lucide-icon>
                </button>
              </div>
              
              <div class="card-content">
                <div class="card-header">
                  <span class="category-tag">{{ product.categoria }}</span>
                  <div class="rating">
                    <lucide-icon name="star" class="star-icon"></lucide-icon>
                    <span>4.5</span>
                  </div>
                </div>
                <h3 [routerLink]="['/producto', product.id]">{{ product.nombre }}</h3>
                <div class="card-footer">
                  <span class="price">{{ product.precio | currency }}</span>
                  <button 
                    (click)="cartService.addToCart(product)"
                    mat-mini-fab color="primary"
                    class="add-cart-btn"
                    title="Añadir al carrito">
                    <lucide-icon name="plus"></lucide-icon>
                  </button>
                </div>
              </div>
            </div>
          } @empty {
            <div class="no-results" @filterAnimation>
              <lucide-icon name="search-x" class="empty-icon"></lucide-icon>
              <p>No se encontraron productos que coincidan con tu búsqueda</p>
              <button (click)="resetFilters()" mat-stroked-button color="primary">Limpiar Filtros</button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shop-container { display: grid; grid-template-columns: 280px 1fr; gap: 40px; padding: 40px 0; }

    /* Filtros */
    .filters-sidebar { position: sticky; top: 100px; height: fit-content; background: white; padding: 24px; border-radius: 24px; border: 1px solid #e2e8f0; }
    .filter-section { margin-bottom: 32px; }
    .filter-section h3 { font-size: 1rem; font-weight: 700; margin-bottom: 16px; color: #1e293b; }
    
    .category-list { display: flex; flex-direction: column; gap: 8px; }
    .category-btn { text-align: left; padding: 10px 16px; border-radius: 12px; border: none; background: transparent; color: #64748b; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .category-btn:hover { background: #f1f5f9; color: #1e293b; }
    .category-btn.active { background: #6366f1; color: white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }

    .price-filter mat-slider { width: 100%; }
    .price-labels { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; color: #6366f1; margin-top: 8px; }

    /* Barra de Búsqueda */
    .search-bar { position: relative; margin-bottom: 32px; }
    .search-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: #94a3b8; width: 20px; height: 20px; }
    .search-bar input { width: 100%; padding: 16px 20px 16px 56px; border-radius: 16px; border: 1px solid #e2e8f0; background: white; font-size: 1rem; transition: all 0.2s; outline: none; }
    .search-bar input:focus { border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }

    /* Grid */
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 32px; }
    
    .product-card { background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
    .product-card:hover { transform: translateY(-8px); border-color: #6366f1; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }

    .card-image { position: relative; aspect-ratio: 1; background: #f8fafc; overflow: hidden; cursor: pointer; }
    .card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
    .product-card:hover .card-image img { transform: scale(1.05); }

    .card-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; backdrop-filter: blur(2px); }
    .card-image:hover .card-overlay { opacity: 1; }
    .view-btn { border-radius: 12px !important; font-weight: 700 !important; }

    .wishlist-btn { position: absolute; top: 16px; right: 16px; background: white !important; color: #94a3b8 !important; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .wishlist-btn.active { color: #ef4444 !important; }
    .wishlist-btn lucide-icon.filled { fill: currentColor; }

    .card-content { padding: 24px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .category-tag { background: #f5f3ff; color: #6366f1; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
    
    .rating { display: flex; align-items: center; gap: 4px; font-size: 0.85rem; font-weight: 700; color: #f59e0b; }
    .star-icon { width: 14px; height: 14px; fill: currentColor; }

    .card-content h3 { margin: 0 0 16px; font-size: 1.1rem; font-weight: 700; color: #1e293b; cursor: pointer; transition: color 0.2s; }
    .card-content h3:hover { color: #6366f1; }

    .card-footer { display: flex; justify-content: space-between; align-items: center; }
    .price { font-size: 1.25rem; font-weight: 800; color: #1e293b; }
    .add-cart-btn { box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4) !important; }

    .no-results { grid-column: 1 / -1; text-align: center; padding: 80px 20px; color: #64748b; }
    .empty-icon { width: 64px; height: 64px; margin: 0 auto 20px; opacity: 0.2; }
    .no-results p { font-size: 1.1rem; font-weight: 500; margin-bottom: 24px; }

    @media (max-width: 900px) {
      .shop-container { grid-template-columns: 1fr; }
      .filters-sidebar { position: static; }
    }
  `]
})
export class ProductListComponent {
  private productService = inject(ProductService);
  public cartService = inject(CartService);
  public wishlistService = inject(WishlistService);

  products = signal<Producto[]>([]);
  selectedCategory = signal('Todos');
  searchQuery = signal('');
  maxPrice = signal(2000);

  categories = ['Todos', 'Electrónica', 'Hogar', 'Moda', 'Deportes', 'Accesorios'];

  filteredProducts = computed(() => {
    return this.products().filter(p => {
      const matchesCategory = this.selectedCategory() === 'Todos' || p.categoria === this.selectedCategory();
      const matchesSearch = p.nombre.toLowerCase().includes(this.searchQuery().toLowerCase());
      const matchesPrice = p.precio <= this.maxPrice();
      return matchesCategory && matchesSearch && matchesPrice;
    });
  });

  constructor() {
    this.productService.getProducts().subscribe((prods: Producto[]) => {
      this.products.set(prods);
    });
  }

  resetFilters() {
    this.selectedCategory.set('Todos');
    this.searchQuery.set('');
    this.maxPrice.set(2000);
  }
}

