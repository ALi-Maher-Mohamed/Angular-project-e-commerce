import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm {
  isEdit = false;
  product: Product = this.emptyProduct();

  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  get cancelLink(): string {
    return this.authService.isAdmin ? '/admin/dashboard' : '/products';
  }

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.productService.fetchById(id).subscribe({
        next: (product) => {
          this.product = { ...product };
          this.cdr.markForCheck();
        },
        error: () => {
          this.router.navigate(['/error']);
        },
      });
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    const request = this.isEdit
      ? this.productService.update(this.product)
      : this.productService.add(this.product);

    request.subscribe({
      next: () => this.router.navigate([this.cancelLink]),
      error: (error) => console.error('Failed to save product', error),
    });
  }

  private emptyProduct(): Product {
    return {
      id: 0,
      title: '',
      description: '',
      price: 0,
      discountPercentage: 0,
      rating: 0,
      stock: 0,
      brand: '',
      category: '',
      thumbnail: '',
      images: [],
    };
  }
}
