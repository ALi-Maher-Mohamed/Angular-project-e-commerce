import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { Favorite } from '../models/favorite';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
    private apiUrl = 'http://localhost:3000/favorites';
    private favoritesSignal = signal<Favorite[]>([]);

    readonly favorites = this.favoritesSignal.asReadonly();

    constructor(private http: HttpClient) {
        this.loadFavorites().subscribe({ next: () => { }, error: (error) => console.error('Failed to load favorites', error) });
    }

    loadFavorites(): Observable<Favorite[]> {
        return this.http.get<Favorite[]>(this.apiUrl).pipe(
            tap((favorites) => this.favoritesSignal.set(favorites)),
            catchError((error) => {
                console.error(error);
                return EMPTY;
            }),
        );
    }

    getByProductId(productId: number): Favorite | undefined {
        return this.favoritesSignal().find((favorite) => favorite.productId === productId);
    }

    toggleFavorite(productId: number): Observable<Favorite | void> {
        const existing = this.getByProductId(productId);
        if (existing) {
            return this.http.delete<void>(`${this.apiUrl}/${existing.id}`).pipe(
                tap(() =>
                    this.favoritesSignal.update((favorites) => favorites.filter((item) => item.id !== existing.id)),
                ),
                catchError((error) => {
                    console.error(error);
                    return EMPTY;
                }),
            );
        }

        return this.http.post<Favorite>(this.apiUrl, { productId }).pipe(
            tap((favorite) => this.favoritesSignal.update((favorites) => [...favorites, favorite])),
            catchError((error) => {
                console.error(error);
                return EMPTY;
            }),
        );
    }

    removeByProductId(productId: number): Observable<void> {
        const existing = this.getByProductId(productId);
        if (!existing) {
            return EMPTY;
        }
        return this.http.delete<void>(`${this.apiUrl}/${existing.id}`).pipe(
            tap(() =>
                this.favoritesSignal.update((favorites) => favorites.filter((item) => item.id !== existing.id)),
            ),
            catchError((error) => {
                console.error(error);
                return EMPTY;
            }),
        );
    }
}
