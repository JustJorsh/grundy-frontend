import { Component, OnInit } from '@angular/core';
import { Product, ApiService } from '../../services/api.service';
import { OrderService, CartItem } from '../../services/order.service';
import { Router } from '@angular/router';
import { UtilsService } from '../../services/utils.service'; // Add this import

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';

  cart: CartItem[] = [];

  constructor(
    private api: ApiService,
    private orderService: OrderService,
    private router: Router,
    private utils: UtilsService // Add this
  ) { }

  ngOnInit(): void {
    this.cart = this.orderService.getCart();
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading = true;
    this.api.getProducts().subscribe({
      next: (res: any) => {
        // handle either Product[] or { products: Product[], ... }
        if (Array.isArray(res)) {
          this.products = res;
        } else if (res && Array.isArray(res.products)) {
          this.products = res.products;
        } else {
          this.products = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  addToCart(product: Product): void {
    // many parts of the app expect a product.productId — keep compatibility by adding productId
    const payload: any = { ...product, productId: product._id };
    this.orderService.addToCart(payload);
    this.cart = this.orderService.getCart();
    alert(`Added ${product.name} to cart!`);
  }

  removeFromCart(productId: string): void {
    this.orderService.removeFromCart(productId);
    this.cart = this.orderService.getCart();
  }

  getCartTotal(): number {
    return this.orderService.getCartTotal();
  }

  getCartItemCount(): number {
    return this.orderService.getCartItemCount();
  }

  formatCurrency(amount: number): string {
    return this.utils.formatCurrency(amount);
  }

  formatNumber(amount: number): string {
    return this.utils.formatNumber(amount);
  }

  proceedToCheckout(): void {
    if (this.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  viewProduct(productId: string | undefined): void {
    if (!productId) {
      console.error('Product ID is required');
      return;
    }
    this.router.navigate(['/products', productId]);
  }
}