import { Injectable, signal, computed, effect } from '@angular/core';
import { Producto } from '../models/producto.model';

export interface CartItem extends Producto {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>(this.loadCart());

  constructor() {
    // Persistencia automática cada vez que cambie el carrito
    effect(() => {
      localStorage.setItem('nova_cart', JSON.stringify(this.cartItems()));
    });
  }

  private loadCart(): CartItem[] {
    const saved = localStorage.getItem('nova_cart');
    return saved ? JSON.parse(saved) : [];
  }

  // Selectores usando signals computados
  items = computed(() => this.cartItems());
  
  totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.precio * item.quantity), 0)
  );

  addToCart(product: Producto) {
    this.cartItems.update(items => {
      const existingItem = items.find(i => i.id === product.id);
      if (existingItem) {
        return items.map(i => 
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
  }

  removeFromCart(productId: number) {
    this.cartItems.update(items => items.filter(i => i.id !== productId));
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items => 
      items.map(i => i.id === productId ? { ...i, quantity } : i)
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
