import { Injectable, signal, computed, effect } from '@angular/core';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = signal<Producto[]>(this.loadWishlist());

  constructor() {
    effect(() => {
      localStorage.setItem('nova_wishlist', JSON.stringify(this.wishlistItems()));
    });
  }

  private loadWishlist(): Producto[] {
    const saved = localStorage.getItem('nova_wishlist');
    return saved ? JSON.parse(saved) : [];
  }

  items = computed(() => this.wishlistItems());
  
  count = computed(() => this.wishlistItems().length);

  isInWishlist(productId: number): boolean {
    return this.wishlistItems().some(p => p.id === productId);
  }

  toggleWishlist(product: Producto) {
    this.wishlistItems.update(items => {
      const exists = items.find(p => p.id === product.id);
      if (exists) {
        return items.filter(p => p.id !== product.id);
      }
      return [...items, product];
    });
  }

  clearWishlist() {
    this.wishlistItems.set([]);
  }
}
