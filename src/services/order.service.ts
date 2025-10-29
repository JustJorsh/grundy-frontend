import { Injectable } from '@angular/core';
import { Product } from './api.service';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private cart: CartItem[] = [];

  constructor() { }

  getCart(): CartItem[] {
    return this.cart;
  }

  // accept flexible product shapes (Product from API uses _id; some callers pass an object with productId)
  addToCart(product: any, quantity: number = 1): void {
    const id = product?.productId || product?._id;
    if (!id) {
      console.warn('addToCart: product missing id', product);
      return;
    }

    const existingItem = this.cart.find(item => item.productId === id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        productId: id,
        name: product.name || 'Item',
        price: Number(product.price) || 0,
        quantity: quantity
      });
    }
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(item => item.productId !== productId);
  }

  clearCart(): void {
    this.cart = [];
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItemCount(): number {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }
}