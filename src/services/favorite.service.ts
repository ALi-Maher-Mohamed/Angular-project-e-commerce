import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY, Observable, throwError } from 'rxjs';
import { Favorite } from '../models/favorite';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
    private apiUrl = 'http://localhost:3000/favorites';
    private favoritesSignal = signal<Favorite[]>([]);
    private messageService = inject(MessageService);

    readonly favorites = this.favoritesSignal.asReadonly();

    constructor(private http: HttpClient) {
        this.loadFavorites().subscribe({ next: () => { }, error: () => { } });
    }

    loadFavorites(): Observable<Favorite[]> {
        return this.http.get<Favorite[]>(this.apiUrl).pipe(
            tap((favorites) => this.favoritesSignal.set(favorites)),
            catchError(() => EMPTY),
        );
    }

    getByProductId(productId: number | string): Favorite | undefined {
        const strId = String(productId);
        return this.favoritesSignal().find(
            (favorite) => String(favorite.productId) === strId,
        );
    }

    toggleFavorite(productId: number | string): Observable<Favorite | void> {
        const existing = this.getByProductId(productId);
        if (existing) {
            return this.http.delete<void>(`${this.apiUrl}/${existing.id}`).pipe(
                tap(() =>
                    this.favoritesSignal.update((favorites) => favorites.filter((item) => item.id !== existing.id)),
                ),
                catchError((error) => {
                    this.messageService.show(error.error?.message || 'Failed to remove from favorites');
                    return throwError(() => error);
                }),
            );
        }

        return this.http.post<Favorite>(this.apiUrl, { productId: String(productId) }).pipe(
            tap((favorite) => this.favoritesSignal.update((favorites) => [...favorites, favorite])),
            catchError((error) => {
                this.messageService.show(error.error?.message || 'Failed to add to favorites');
                return throwError(() => error);
            }),
        );
    }

    removeByProductId(productId: number | string): Observable<void> {
        const existing = this.getByProductId(productId);
        if (!existing) {
            return EMPTY;
        }
        return this.http.delete<void>(`${this.apiUrl}/${existing.id}`).pipe(
            tap(() =>
                this.favoritesSignal.update((favorites) => favorites.filter((item) => item.id !== existing.id)),
            ),
            catchError((error) => {
                this.messageService.show(error.error?.message || 'Failed to remove from favorites');
                return throwError(() => error);
            }),
        );
    }
}
