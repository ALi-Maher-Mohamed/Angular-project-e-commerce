import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private messageSignal = signal<string | null>(null);
  readonly message = this.messageSignal.asReadonly();

  private typeSignal = signal<'error' | 'success'>('error');
  readonly type = this.typeSignal.asReadonly();

  show(text: string, type: 'error' | 'success' = 'error'): void {
    this.messageSignal.set(text);
    this.typeSignal.set(type);
  }

  clear(): void {
    this.messageSignal.set(null);
  }
}
