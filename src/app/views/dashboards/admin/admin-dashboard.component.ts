import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { NavBarComponent } from '../../../components/shared/nav-bar/nav-bar.component';
import { SectionTitleComponent } from '../../../components/shared/section-title/section-title.component';
import { CardComponent } from '../../../components/shared/card/card.component';
import { BtnComponent } from '../../../components/shared/btn/btn.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavBarComponent, SectionTitleComponent, CardComponent, BtnComponent],
  template: `
    <div class="dashboard-container">
      <app-nav-bar 
        [userName]="user?.name || ''" 
        userRole="Administrador" 
        [activeItem]="'admin'" 
        [navItems]="navItems" 
        (logout)="onLogout()">
      </app-nav-bar>

      <div class="main-content">
        <div class="header-section">
          <div>
            <h1>Panel de Administración</h1>
            <p style="color: var(--ibero-gray-mid); font-size: 13px;">Gestión global de la plataforma IBERO MAP</p>
          </div>
        </div>

        <div class="admin-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
          <app-card>
            <app-section-title icon="settings">Configuración General</app-section-title>
            <p>Ajustes globales del sistema, periodos académicos y parámetros institucionales.</p>
            <app-btn [sm]="true" variant="primary" style="margin-top: 15px;">Ir a Ajustes</app-btn>
          </app-card>

          <app-card>
            <app-section-title icon="security">Seguridad y Roles</app-section-title>
            <p>Gestión de permisos, auditoría de accesos y control de sesiones.</p>
            <app-btn [sm]="true" variant="primary" style="margin-top: 15px;">Gestionar Seguridad</app-btn>
          </app-card>

          <app-card>
            <app-section-title icon="database">Mantenimiento de Datos</app-section-title>
            <p>Backups, depuración de registros y sincronización con sistemas externos.</p>
            <app-btn [sm]="true" variant="primary" style="margin-top: 15px;">Ejecutar Tareas</app-btn>
          </app-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { min-height: 100vh; background: var(--ibero-bg); }
    .main-content { padding: 30px; max-width: 1200px; margin: 0 auto; }
    .header-section h1 { font-size: 24px; font-weight: 700; color: var(--ibero-black); margin: 0; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  user: User | null = null;
  navItems = [
    { id: 'admin', label: 'Admin', icon: 'settings' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    if (!this.user || this.user.role !== 'admin') {
      this.router.navigate(['/login']);
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
