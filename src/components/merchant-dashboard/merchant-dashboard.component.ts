import { Component } from '@angular/core';
import { ApiService, Product } from '../../services/api.service'; // Import Product interface
import { Router } from '@angular/router';

interface Merchant {
  email: string;
  password: string;
  businessName?: string;
  phone?: string;
  address?: string;
  type?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

interface Customer {
  email: string;
  name?: string; // Optional property
}

interface Order {
  orderId: string;
  payment: {
    amount: number;
    method: string;
    status: string;
  };
  totalAmount: number;
  createdAt: string;
  customer: Customer; // Add customer property
  status: string; // Add status property
}

interface Analytics {
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

@Component({
  selector: 'app-merchant-dashboard',
  templateUrl: './merchant-dashboard.component.html',
  styleUrls: ['./merchant-dashboard.component.css']
})
export class MerchantDashboardComponent {
  currentTab = 'register';
  isLoggedIn = false;
  showRegisterForm = false;
  errorMessage: string | null = null;
  merchant: Merchant = {
    email: '',
    password: '',
    businessName: '',
    phone: '',
    address: '',
    type: '',
    bankDetails: {
      bankName: '',
      accountNumber: '',
      accountName: ''
    }


  };

  newProduct: Product = {
    name: '',
    price: 0,
    stock: 0,
    category: ''
  };

   banks: any[] = [];
  selectedBankCode: string = '';
  loading = true;

  orders: Order[] = [];
  analytics: Analytics = {
    totalOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  };

  merchantProducts: Product[] = []; // Add this property
  merchantId: string | null = null;

  constructor(private api: ApiService, private router: Router) {}

  async loginMerchant(): Promise<void> {
    this.showRegisterForm = false;
    this.errorMessage = null;
    this.api.loginMerchant({ email: this.merchant.email, password: this.merchant.password }).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.isLoggedIn = true;
          this.showRegisterForm = false;
          if (res.token) {
        localStorage.setItem('authToken', res.token);
        this.isLoggedIn = true;
        this.fetchMerchantProducts();
      }
          if (res.merchant?.id) {
            this.merchantId = res.merchant.id;
            this.currentTab = 'products';
            this.fetchMerchantProducts(); // Fetch products after login
          }
        } else {
          this.errorMessage = res?.message || 'Login failed';
        }
      },
      error: () => this.errorMessage = 'Login request failed'
    });
  }

  ngOnInit(): void {
    this.api.getBanks().subscribe({
      next: (res: any) => {
        this.banks = res.data; // Paystack returns { status, message, data: [...] }
        this.loading = false;
      },
      error: () => {
        console.error('Error fetching banks:', this.errorMessage);
        this.loading = false;
      }
    });
  }

  onBankSelect(event: any): void {
    this.selectedBankCode = event.target.value;
    console.log('Selected Bank Code:', this.selectedBankCode);
  }

  registerMerchant(): void {
    this.errorMessage = null;

    const payload = {
      businessName: this.merchant.businessName || '',
      email: this.merchant.email || '',
      phone: this.merchant.phone || '',
      address: this.merchant.address || '',
      type: this.merchant.type || '',
      password: this.merchant.password || '',
      bankDetails: this.merchant.bankDetails || { bankName: '', accountNumber: '', accountName: '' }
    };

    this.api.registerMerchant(payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          if (res.token) localStorage.setItem('token', res.token);
          this.isLoggedIn = true;
          this.errorMessage = null;
          // optional: set merchantId if returned
          // this.merchantId = res.merchant?._id || null;
          this.fetchOrders();
          this.fetchAnalytics();
        } else {
          this.errorMessage = res?.message || 'Registration failed';
        }
      },
      error: () => {
        this.errorMessage = 'Registration request failed';
      }
    });
  }

  addProduct(): void {
    if (!this.isLoggedIn) { this.errorMessage = 'Login required'; return; }
    const payload = { ...this.newProduct };
    this.api.addProduct(payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.newProduct = { name: '', price: 0, stock: 0, category: '' };
          this.fetchMerchantProducts(); // refresh list if needed
        } else {
          this.errorMessage = res?.message || 'Failed to add product';
        }
      },
      error: () => this.errorMessage = 'Add product request failed'
    });
  }

  fetchOrders(): void {
    if (!this.isLoggedIn) return;
    this.api.getMerchantOrders().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
        this.orders = res;
      } else if (res?.orders && Array.isArray(res.orders)) {
        this.orders = res.orders;
      } else if (res?.data?.orders && Array.isArray(res.data.orders)) {
        this.orders = res.data.orders;
      } else {
        this.orders = [];
        console.warn('Unexpected orders response structure:', res);
      }
      },
      error: () => { /* swallow for now */ }
    });
  }

  fetchAnalytics(): void {
    if (!this.isLoggedIn) return;
    this.api.getMerchantAnalytics().subscribe({
      next: (res: any) => {
        this.analytics = res?.analytics || res || this.analytics;
      },
      error: () => { /* swallow for now */ }
    });
  }

  fetchMerchantProducts(): void {
    if (!this.merchantId) return;
    
    this.api.getMerchantProducts(this.merchantId).subscribe({
      next: (response: any) => {
        if (response?.products) {
          this.merchantProducts = response.products;
        } else if (Array.isArray(response)) {
          this.merchantProducts = response;
        }
      },
      error: (err) => {
        console.error('Failed to fetch products:', err);
        this.errorMessage = 'Failed to load products';
      }
    });
  }

  formatCurrency(amount: number): string {
    return `N${amount.toFixed(2)}`;
  }
}