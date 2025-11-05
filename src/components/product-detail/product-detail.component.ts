import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Product } from '../../services/api.service';
import { OrderService } from '../../services/order.service';
import { UtilsService } from '../../services/utils.service';
import { SnackbarService } from 'src/app/snackbar.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product?: Product | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private orderService: OrderService,
    private utils: UtilsService,
    private router: Router,
        private snackbarService: SnackbarService

  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Invalid product id';
      this.loading = false;
      return;
    }

    this.api.getProduct(id).subscribe({
      next: (res: any) => {
        // normalize backend wrapper { success, product } or plain product object
        if (res && res.product) {
          this.product = res.product as Product;
        } else {
          this.product = res as Product;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load product', err);
        this.error = 'Failed to load product';
        this.loading = false;
      }
    });
  }

  addToCart(): void {
    if (!this.product) return;
    this.orderService.addToCart(this.product, 1);
    this.snackbarService.success(`Added ${this.product.name} to cart!`);
  }

  formatCurrency(amount: number): string {
    return this.utils.formatCurrency(amount);
  }

  goBack(): void {
    this.router.navigate(['/marketplace']);
  }
}