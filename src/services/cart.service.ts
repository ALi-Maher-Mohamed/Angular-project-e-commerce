import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';

@Injectable({ providedIn: 'root' })
export class CartService {
    private apiUrl = 'http://localhost:3000/cart';
    private cartItemsSignal = signal<CartItem[]>([]);

    readonly cartItems = this.cartItemsSignal.asReadonly();

    constructor(private http: HttpClient) {
        this.loadCart().subscribe({ next: () => { }, error: (error) => console.error('Failed to load cart', error) });
    }

    loadCart(): Observable<CartItem[]> {
        return this.http.get<CartItem[]>(this.apiUrl).pipe(
            tap((items) => this.cartItemsSignal.set(items)),
            catchError((error) => {
                console.error(error);
                return EMPTY;
            }),
        );
    }

    addToCart(productId: number, quantity: number): Observable<CartItem> {
        const existing = this.cartItemsSignal().find((item) => item.productId === productId);
        if (existing) {
            const updated = { ...existing, quantity: existing.quantity + quantity };
            return this.http.put<CartItem>(`${this.apiUrl}/${existing.id}`, updated).pipe(
                tap((item) =>
                    this.cartItemsSignal.update((items) =>
                        items.map((current) => (current.id === item.id ? item : current)),
                    ),
                ),
                catchError((error) => {
                    console.error(error);
                    return EMPTY;
                }),
            );
        }

        return this.http.post<CartItem>(this.apiUrl, { productId, quantity }).pipe(
            tap((item) => this.cartItemsSignal.update((items) => [...items, item])),
            catchError((error) => {
                console.error(error);
                return EMPTY;
            }),
        );
    }

    updateQuantity(item: CartItem): Observable<CartItem> {
        return this.http.put<CartItem>(`${this.apiUrl}/${item.id}`, item).pipe(
            tap((updated) =>
                this.cartItemsSignal.update((items) =>
                    items.map((current) => (current.id === updated.id ? updated : current)),
                ),
            ),
            catchError((error) => {
                console.error(error);
                return EMPTY;
            }),
        );
    }

    remove(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() =>
                this.cartItemsSignal.update((items) => items.filter((item) => item.id !== id)),
            ),
            catchError((error) => {
                console.error(error);
                return EMPTY;
            }),
        );
    }

    removeByProductId(productId: number): Observable<void> {
        const item = this.cartItemsSignal().find((current) => current.productId === productId);
        if (!item) {
            return EMPTY;
        }
        return this.remove(item.id);
    }
}
