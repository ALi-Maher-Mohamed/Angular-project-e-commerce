import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-favorites',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './favorites.html',
    styleUrl: './favorites.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Favorites {
    private favoriteService = inject(FavoriteService);
    private productService = inject(ProductService);

    readonly favorites = this.favoriteService.favorites;
    readonly products = this.productService.products;

    readonly favoriteProducts = computed(() =>
        this.favorites().map((favorite) => this.products().find((product) => String(product.id) === String(favorite.productId))).filter(Boolean),
    );

    onRemoveFavorite(productId: number | string): void {
        this.favoriteService.removeByProductId(productId).subscribe();
    }
}
