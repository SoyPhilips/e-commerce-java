import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface User {
  email: string;
  role: 'admin' | 'user';
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(this.loadUser());

  user = computed(() => this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isLoggedIn = computed(() => !!this.currentUser());

  constructor() {}

  private loadUser(): User | null {
    const saved = localStorage.getItem('nova_user');
    return saved ? JSON.parse(saved) : null;
  }

  login(email: string, password: string): Observable<boolean> {
    // Simulación de login
    const role: 'admin' | 'user' = email.includes('admin') ? 'admin' : 'user';
    const user: User = {
      email,
      role,
      name: email.split('@')[0]
    };
    
    this.currentUser.set(user);
    localStorage.setItem('nova_user', JSON.stringify(user));
    return of(true).pipe(delay(1000));
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('nova_user');
  }
}
