import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  signup(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  login(username: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find((u) => u.username === username && u.password === password) ?? null;
        if (user) {
          this.currentUserSubject.next(user);
        }
        return user;
      }),
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }
}
