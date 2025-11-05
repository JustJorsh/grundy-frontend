import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  orderId: string;
  customer: {
    email: string;
    phone: string;
    address: string;
    name?: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  payment: {
    method: string;
    status: string;
    paystackReference?: string;
  };
  status: string;
  createdAt?: string;
}

export interface Product {
  _id?: string;  // Make _id optional since new products won't have one
  name: string;
  description?: string;
  price: number;
  category: string;
  stock?: number;
  available?: boolean;
  unit?: string;
  merchant?: {
    id?: string;
    businessName?: string;
  };
  image?: string;
}

export interface Merchant {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://grundy-backend.onrender.com/api';
  // private baseUrl = 'http://localhost:5200/api';


  constructor(private http: HttpClient) { }

  // Order APIs
  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders`, orderData);
  }

  getOrder(orderId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/${orderId}`);
  }

  getUserOrders(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders?email=${email}`);
  }

   getBanks(): Observable<any> {
    // Optionally: add ?country=nigeria or ?type=mobile_money
    return this.http.get('https://api.paystack.co/bank');
  }

  // Payment APIs
  verifyPayment(reference: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/payments/verify`, { reference });
  }

  getPaymentStatus(orderId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/payments/order/${orderId}/status`);
  }

  getVirtualAccount(orderId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/payments/order/${orderId}/virtual-account`);
  }

  processTerminalPayment(sessionId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/payments/terminal/process`, { sessionId });
  }

  // Merchant APIs
  registerMerchant(merchantData: Merchant): Observable<any> {
    return this.http.post(`${this.baseUrl}/merchants/register`, merchantData);
  }

  loginMerchant(merchantData: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/merchants/login`, merchantData);
  }


  // Public product routes
  getMerchantProducts(merchantId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/merchants/${merchantId}/products`);
  }

  // Authenticated merchant routes (token should be handled by your interceptor)
  getMerchantOrders(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/merchants/orders`);
  }

  getMerchantAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/merchants/analytics`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/merchants/products`, product);
  }

  // Product APIs — use top-level /products routes
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/merchants/products`);
  }

  getProduct(productId: string): Observable<any> {
    // backend returns { success: true, product: { ... } }
    return this.http.get<any>(`${this.baseUrl}/merchants/products/${productId}`);
  }

  // Rider APIs
  updateRiderLocation(location: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/riders/location`, location);
  }

  getAvailableOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/riders/orders/available`);
  }

  acceptOrder(orderId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/riders/orders/accept`, { orderId });
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/riders/orders/${orderId}/status`, { status });
  }
}