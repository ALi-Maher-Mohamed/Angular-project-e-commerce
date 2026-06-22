import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY, Observable, throwError } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class CartService {
    private apiUrl = 'http://localhost:3000/cart';
    private cartItemsSignal = signal<CartItem[]>([]);
    private messageService = inject(MessageService);

    readonly cartItems = this.cartItemsSignal.asReadonly();

    constructor(private http: HttpClient) {
        this.loadCart().subscribe({ next: () => { }, error: () => { } });
    }

    loadCart(): Observable<CartItem[]> {
        return this.http.get<CartItem[]>(this.apiUrl).pipe(
            tap((items) => this.cartItemsSignal.set(items)),
            catchError(() => EMPTY),
        );
    }

    addToCart(productId: number | string, quantity: number): Observable<CartItem> {
        const strId = String(productId);
        const existing = this.cartItemsSignal().find(
            (item) => String(item.productId) === strId,
        );
        if (existing) {
            const updated = { ...existing, quantity: existing.quantity + quantity };
            return this.http.put<CartItem>(`${this.apiUrl}/${existing.id}`, { productId: existing.productId, quantity: updated.quantity }).pipe(
                tap((item) =>
                    this.cartItemsSignal.update((items) =>
                        items.map((current) => (current.id === item.id ? item : current)),
                    ),
                ),
                catchError((error) => {
                    this.messageService.show(error.error?.message || 'Failed to update cart');
                    return throwError(() => error);
                }),
            );
        }

        return this.http.post<CartItem>(this.apiUrl, { productId: strId, quantity }).pipe(
            tap((item) => this.cartItemsSignal.update((items) => [...items, item])),
            catchError((error) => {
                this.messageService.show(error.error?.message || 'Failed to add to cart');
                return throwError(() => error);
            }),
        );
    }

    updateQuantity(item: CartItem): Observable<CartItem> {
        return this.http.put<CartItem>(`${this.apiUrl}/${item.id}`, { productId: item.productId, quantity: item.quantity }).pipe(
            tap((updated) =>
                this.cartItemsSignal.update((items) =>
                    items.map((current) => (current.id === updated.id ? updated : current)),
                ),
            ),
            catchError((error) => {
                this.messageService.show(error.error?.message || 'Failed to update quantity');
                return throwError(() => error);
            }),
        );
    }

    remove(id: number | string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                const strId = String(id);
                this.cartItemsSignal.update((items) =>
                    items.filter((item) => String(item.id) !== strId),
                );
            }),
            catchError((error) => {
                this.messageService.show(error.error?.message || 'Failed to remove from cart');
                return throwError(() => error);
            }),
        );
    }

    removeByProductId(productId: number | string): Observable<void> {
        const strId = String(productId);
        const item = this.cartItemsSignal().find(
            (current) => String(current.productId) === strId,
        );
        if (!item) {
            return EMPTY;
        }
        return this.remove(item.id);
    }
}
