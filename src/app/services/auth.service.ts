import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  mapRole: string;
  faculty?: string;
  role?: string; // used by frontend components (lower case)
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:7000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userStr = localStorage.getItem('iberomap_user');
    const token = localStorage.getItem('iberomap_token');
    
    if (userStr && token) {
      this.currentUserSubject.next(JSON.parse(userStr));
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    return localStorage.getItem('iberomap_token');
  }

  login(credentials: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('iberomap_token', response.token);
            // Assign lower case role for frontend ease
            response.user.role = response.user.mapRole.toLowerCase();
            localStorage.setItem('iberomap_user', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('iberomap_token');
    localStorage.removeItem('iberomap_user');
    this.currentUserSubject.next(null);
    
    // Call backend to invalidate optionally, but ignore result
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  updateUser(userData: Partial<User>): void {
    const current = this.currentUserSubject.value;
    if (current) {
      const updated = { ...current, ...userData };
      localStorage.setItem('iberomap_user', JSON.stringify(updated));
      this.currentUserSubject.next(updated);
    }
  }
}
