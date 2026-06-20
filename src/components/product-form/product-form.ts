import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

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

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      const found = this.productService.getById(Number(id));
      if (!found) {
        this.router.navigate(['/error']);
        return;
      }
      this.product = { ...found };
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    const request = this.isEdit
      ? this.productService.update(this.product)
      : this.productService.add(this.product);

    request.subscribe({
      next: () => this.router.navigate(['/products']),
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
