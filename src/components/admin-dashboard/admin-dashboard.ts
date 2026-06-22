import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboard {
  private productService = inject(ProductService);

  readonly products = this.productService.products;
  readonly totalCount = computed(() => this.products().length);
  readonly inStockCount = computed(() => this.products().filter((p) => p.stock > 0).length);
  readonly outOfStockCount = computed(() => this.products().filter((p) => p.stock === 0).length);

  onDelete(id: number | string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe();
    }
  }
}
