import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { AppComponent } from './app.component';
import { MarketplaceComponent } from '../components/marketplace/marketplace.component';
import { CheckoutComponent } from '../components/checkout/checkout.component';
import { OrderTrackingComponent } from '../components/order-tracking/order-tracking.component';
import { MerchantDashboardComponent } from '../components/merchant-dashboard/merchant-dashboard.component';
import { RiderDashboardComponent } from '../components/rider-dashboard/rider-dashboard.component';
import { ProductDetailComponent } from '../components/product-detail/product-detail.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from "@angular/material/card";

const routes: Routes = [
  { path: '', component: MarketplaceComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'track-order', component: OrderTrackingComponent },
  { path: 'merchant-dashboard', component: MerchantDashboardComponent },
  { path: 'rider-dashboard', component: RiderDashboardComponent },
  { path: 'products/:id', component: ProductDetailComponent }, // <- new route
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    MarketplaceComponent,
    CheckoutComponent,
    OrderTrackingComponent,
    MerchantDashboardComponent,
    RiderDashboardComponent,
    ProductDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule, // Add this line
    RouterModule.forRoot(routes),
    MatCardModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    MatSnackBar
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }