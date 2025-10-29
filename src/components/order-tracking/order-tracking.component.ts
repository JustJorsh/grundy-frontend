import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UtilsService } from '../../services/utils.service';

interface Order {
  orderId: string;
  status: string;
  createdAt: string;
  payment: {
    method: string;
    status: string;
    amount: number;
    platformFee: number;
    merchantAmount: number;
    paystackReference?: string;
  };
  delivery: {
    status: string;
    estimatedDelivery: string;
  };
  customerId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  merchantId: {
    _id: string;
    businessName: string;
    type: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
    _id: string;
  }>;
  updatedAt: string;
}

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css']
})
export class OrderTrackingComponent implements OnInit {
  trackOrderId = '';
  trackedOrder: Order | null = null;
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['orderId']) {
        this.trackOrderId = params['orderId'];
        this.trackOrder();
      }
    });
  }

  formatCurrency(amount: number): string {
    return this.utils.formatCurrency(amount);
  }

  trackOrder(): void {
    if (!this.trackOrderId) {
      alert('Please enter an order ID');
      return;
    }

    this.isLoading = true;
    this.apiService.getOrder(this.trackOrderId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.trackedOrder = response.order;
        } else {
          alert('Order not found');
          this.trackedOrder = null;
        }
      },
      error: (error) => {
        this.isLoading = false;
        alert('Error tracking order: ' + error.error.error);
        this.trackedOrder = null;
      }
    });
  }

  getProgressWidth(status: string): string {
    const statuses = ['created', 'confirmed', 'preparing', 'ready', 'in_transit', 'delivered'];
    const progress = (statuses.indexOf(status) + 1) * (100 / statuses.length);
    return progress + '%';
  }
}