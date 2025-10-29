import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UtilsService } from '../../services/utils.service'; // Add this

@Component({
  selector: 'app-rider-dashboard',
  templateUrl: './rider-dashboard.component.html',
  styleUrls: ['./rider-dashboard.component.css']
})
export class RiderDashboardComponent implements OnInit {
  availableOrders: any[] = [];
  currentOrder: any = null;
  riderStats = {
    totalDeliveries: 0,
    todayDeliveries: 0,
    totalEarnings: 0,
    rating: 0
  };
  
  location = { lat: 0, lng: 0 };

  constructor(
    private apiService: ApiService,
    private utils: UtilsService // Add this
  ) { }

  ngOnInit(): void {
    this.updateLocation();
    this.loadAvailableOrders();
    this.loadRiderStats();
    
    // Update location every 30 seconds
    setInterval(() => {
      this.updateLocation();
    }, 30000);
  }

  // Add formatting method
  formatCurrency(amount: number): string {
    return this.utils.formatCurrency(amount);
  }

  updateLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location.lat = position.coords.latitude;
        this.location.lng = position.coords.longitude;
        
        this.apiService.updateRiderLocation(this.location).subscribe({
          next: (response) => {
            if (response.success) {
              console.log('Location updated');
            }
          },
          error: (error) => {
            console.error('Error updating location:', error);
          }
        });
      });
    }
  }

  loadAvailableOrders(): void {
    this.apiService.getAvailableOrders().subscribe({
      next: (response) => {
        if (response.success) {
          this.availableOrders = response.orders;
        }
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  acceptOrder(orderId: string): void {
    this.apiService.acceptOrder(orderId).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Order accepted successfully!');
          this.currentOrder = response.order;
          this.loadAvailableOrders();
        } else {
          alert('Failed to accept order: ' + response.error);
        }
      },
      error: (error) => {
        alert('Error accepting order: ' + error.error.error);
      }
    });
  }

  updateOrderStatus(status: string): void {
    if (!this.currentOrder) {
      alert('No current order');
      return;
    }

    this.apiService.updateOrderStatus(this.currentOrder.orderId, status).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Order status updated to: ' + status);
          this.currentOrder = response.order;
          
          if (status === 'delivered') {
            this.currentOrder = null;
            this.loadRiderStats();
          }
        } else {
          alert('Failed to update order status: ' + response.error);
        }
      },
      error: (error) => {
        alert('Error updating order status: ' + error.error.error);
      }
    });
  }

  processTerminalPayment(sessionId: string): void {
    this.apiService.processTerminalPayment(sessionId).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Terminal payment successful!');
        } else {
          alert('Terminal payment failed: ' + response.error);
        }
      },
      error: (error) => {
        alert('Payment error: ' + error.error.error);
      }
    });
  }

  loadRiderStats(): void {
    // Mock data - in real app, this would come from API
    this.riderStats = {
      totalDeliveries: 125,
      todayDeliveries: 8,
      totalEarnings: 125000,
      rating: 4.8
    };
  }
}