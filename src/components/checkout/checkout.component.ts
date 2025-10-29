import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { OrderService } from '../../services/order.service';
import { UtilsService } from '../../services/utils.service'; // Add this

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  customer = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };
  
  selectedPaymentMethod = '';
  cart: any[] = [];
  isProcessing = false;
  order: any = null;
  virtualAccount: any = null;

  paymentMethods = [
    { id: 'online', name: 'Online Payment', description: 'Pay now with card or transfer' },
    { id: 'bank_transfer_delivery', name: 'Bank Transfer on Delivery', description: 'Transfer when rider arrives' },
    { id: 'terminal_delivery', name: 'Terminal on Delivery', description: 'Pay with card via rider terminal' }
  ];

  constructor(
    private orderService: OrderService,
    private apiService: ApiService,
    private router: Router,
    private utils: UtilsService // Add this
  ) { }

  ngOnInit(): void {
    this.cart = this.orderService.getCart();
    if (this.cart.length === 0) {
      this.router.navigate(['/marketplace']);
    }
  }

  getCartTotal(): number {
    return this.orderService.getCartTotal();
  }

  // Add formatting methods
  formatCurrency(amount: number): string {
    return this.utils.formatCurrency(amount);
  }

  formatNumber(amount: number): string {
    return this.utils.formatNumber(amount);
  }

  placeOrder(): void {
    if (!this.customer.email || !this.customer.phone || !this.customer.address) {
      alert('Please fill in all customer details');
      return;
    }

    if (!this.selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    this.isProcessing = true;

    const orderData = {
      customer: this.customer,
      items: this.cart,
      paymentMethod: this.selectedPaymentMethod,
      deliveryAddress: this.customer.address
    };

    this.apiService.createOrder(orderData).subscribe({
      next: (response) => {
        this.isProcessing = false;
        
        if (response.success) {
          this.order = response.order;
          
          if (this.selectedPaymentMethod === 'online') {
            // Redirect to Paystack
            window.location.href = response.paymentData.authorization_url;
          } else if (this.selectedPaymentMethod === 'bank_transfer_delivery') {
            this.virtualAccount = response.paymentData;
            alert('Virtual account created! Check the details for payment.');
          } else if (this.selectedPaymentMethod === 'terminal_delivery') {
            alert('Order created! Pay with terminal when rider arrives.');
          }
          
          this.orderService.clearCart();
          this.router.navigate(['/track-order'], { queryParams: { orderId: this.order.orderId } });
          
        } else {
          alert('Order failed: ' + response.error);
        }
      },
      error: (error) => {
        this.isProcessing = false;
        alert('Order failed: ' + error.error.error);
      }
    });
  }

  // public helper for template navigation
  goToMarketplace(): void {
    this.router.navigate(['/marketplace']);
  }
}