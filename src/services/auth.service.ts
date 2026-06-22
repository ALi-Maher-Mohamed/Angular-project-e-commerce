import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserRole } from '../models/user';
import { JwtPayload } from '../models/jwt';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private expiryTimer: ReturnType<typeof setTimeout> | null = null;

  private initResolve!: () => void;
  readonly initialized = new Promise<void>((resolve) => {
    this.initResolve = resolve;
  });

  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
  ) {
    this.restoreSession();
  }

  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'Admin';
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get tokenPayload(): JwtPayload | null {
    const t = this.token;
    if (!t) return null;
    try {
      return jwtDecode<JwtPayload>(t);
    } catch {
      return null;
    }
  }

  signup(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>('http://localhost:3000/auth/signup', user);
  }

  login(username: string, password: string, role: UserRole): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, { username, password, role }).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, response.token);
        this.currentUserSubject.next(response.user);
        this.scheduleExpiryTimer(response.token);
      }),
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(TOKEN_KEY);
    this.clearExpiryTimer();
  }

  private restoreSession(): void {
    try {
      const token = this.token;
      if (!token) return;

      const payload = jwtDecode<JwtPayload>(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        const user: User = {
          id: payload.sub,
          username: payload.username,
          password: '',
          role: payload.role,
        };
        this.currentUserSubject.next(user);
        this.scheduleExpiryTimer(token);
      } else {
        this.logout();
      }
    } catch {
      this.logout();
    } finally {
      this.initResolve();
    }
  }

  private scheduleExpiryTimer(token: string): void {
    this.clearExpiryTimer();
    try {
      const payload = jwtDecode<JwtPayload>(token);
      if (!payload) return;

      const expiresAt = payload.exp * 1000;
      const now = Date.now();
      const delay = expiresAt - now;

      if (delay <= 0) {
        this.logout();
        return;
      }

      this.ngZone.runOutsideAngular(() => {
        this.expiryTimer = setTimeout(() => {
          this.ngZone.run(() => {
            this.logout();
          });
        }, delay);
      });
    } catch {
      this.logout();
    }
  }

  private clearExpiryTimer(): void {
    if (this.expiryTimer) {
      clearTimeout(this.expiryTimer);
      this.expiryTimer = null;
    }
  }
}
