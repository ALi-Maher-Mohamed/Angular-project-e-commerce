import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { ImageZoomDirective } from '../../directives/image-zoom.directive';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink, ImageZoomDirective],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetails {
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.fetchById(id).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: () => {
        this.router.navigate(['/error']);
      },
    });
  }

  onDelete(): void {
    if (!this.product) return;
    this.productService.delete(this.product.id).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (error) => console.error('Failed to delete product', error),
    });
  }
}
