import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  roleHints = [
    { label: 'Líder de Aseg.', email: 'lider@ibero.edu.co' },
    { label: 'Decano',         email: 'decano@ibero.edu.co' },
    { label: 'Director',       email: 'director@ibero.edu.co' },
    { label: 'Docente',        email: 'docente@ibero.edu.co' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.loading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.user && res.user.role) {
          // Navigate based on role
          this.router.navigate([`/dashboard/${res.user.role}`]);
        }
      },
      error: (err: any) => {
        this.loading = false;
        // In case the API is down or not configured properly during dev, 
        // fall back to mock users matching the prototype for demo purposes.
        if (this.tryMockLogin()) return;

        this.error = 'Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.';
      }
    });
  }

  // Temporary mock logic from original prototype, only used if API fails during migration
  private tryMockLogin(): boolean {
    const USERS = [
      { email: 'lider@ibero.edu.co',    password: '1234', role: 'lider',    name: 'Mónica Torres' },
      { email: 'decano@ibero.edu.co',   password: '1234', role: 'decano',   name: 'Jorge Hernández' },
      { email: 'director@ibero.edu.co', password: '1234', role: 'director', name: 'Laura Gómez' },
      { email: 'docente@ibero.edu.co',  password: '1234', role: 'docente',  name: 'Carlos Ruiz' },
    ];
    
    const user = USERS.find(u => u.email === this.email && u.password === this.password);
    if (user) {
      // simulate auth service setting data
      localStorage.setItem('iberomap_token', 'mock_token');
      localStorage.setItem('iberomap_user', JSON.stringify(user));
      (this.authService as any).currentUserSubject.next(user);
      this.router.navigate([`/dashboard/${user.role}`]);
      return true;
    }
    return false;
  }

  fillHint(email: string) {
    this.email = email;
    this.password = '1234';
  }
}
