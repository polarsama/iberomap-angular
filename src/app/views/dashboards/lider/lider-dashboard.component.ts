import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { NavBarComponent } from '../../../components/shared/nav-bar/nav-bar.component';
import { RoleChipComponent } from '../../../components/shared/role-chip/role-chip.component';
import { StatCardComponent } from '../../../components/shared/stat-card/stat-card.component';
import { SectionTitleComponent } from '../../../components/shared/section-title/section-title.component';
import { CardComponent } from '../../../components/shared/card/card.component';
import { StatusChipComponent } from '../../../components/shared/status-chip/status-chip.component';
import { BtnComponent } from '../../../components/shared/btn/btn.component';

@Component({
  selector: 'app-lider-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent,
    RoleChipComponent,
    StatCardComponent,
    SectionTitleComponent,
    CardComponent,
    StatusChipComponent,
    BtnComponent
  ],
  templateUrl: './lider-dashboard.component.html',
  styleUrls: ['./lider-dashboard.component.css']
})
export class LiderDashboardComponent implements OnInit {
  user: User | null = null;
  activeTab = 'dashboard';
  showModal = false;
  showAssign: any = null;

  navItems = [
    { id: 'dashboard', label: 'Dashboard',  icon: 'dashboard' },
    { id: 'programas', label: 'Programas',  icon: 'list' },
    { id: 'reportes',  label: 'Reportes',   icon: 'bar_chart' },
    { id: 'usuarios',  label: 'Usuarios',   icon: 'group' },
  ];

  programs = [
    { id: 1, name: 'Ingeniería de Sistemas', faculty: 'Ingeniería', type: 'Renovación',     status: 'en progreso', pct: 78, snies: '12345', docentes: 12 },
    { id: 2, name: 'Psicología',             faculty: 'Ciencias Humanas', type: 'Acreditación', status: 'completado',  pct: 92, snies: '23456', docentes: 18 },
    { id: 3, name: 'Administración de Emp.', faculty: 'Ciencias Empresariales', type: 'Renovación', status: 'en progreso', pct: 55, snies: '34567', docentes: 9 },
    { id: 4, name: 'Derecho',                faculty: 'Ciencias Jurídicas', type: 'Autoevaluación', status: 'no iniciado', pct: 0, snies: '45678', docentes: 21 },
    { id: 5, name: 'Contaduría Pública',     faculty: 'Ciencias Empresariales', type: 'Renovación', status: 'en progreso', pct: 41, snies: '56789', docentes: 15 },
    { id: 6, name: 'Medicina',               faculty: 'Ciencias de la Salud', type: 'Acreditación', status: 'completado', pct: 88, snies: '67890', docentes: 30 },
    { id: 7, name: 'Enfermería',             faculty: 'Ciencias de la Salud', type: 'Renovación', status: 'no iniciado', pct: 4, snies: '78901', docentes: 25 },
  ];

  completed = 0;
  inProgress = 0;
  notStarted = 0;
  avgPct = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    if (!this.user || this.user.role !== 'lider') {
      this.router.navigate(['/login']);
    }

    this.calculateStats();
  }

  calculateStats() {
    this.completed = this.programs.filter(p => p.status === 'completado').length;
    this.inProgress = this.programs.filter(p => p.status === 'en progreso').length;
    this.notStarted = this.programs.filter(p => p.status === 'no iniciado').length;
    this.avgPct = Math.round(this.programs.reduce((a, p) => a + p.pct, 0) / this.programs.length);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  setTab(tabId: string) {
    this.activeTab = tabId;
  }

  getUserFirstName(): string {
    return this.user?.name ? this.user.name.split(' ')[0] : 'Usuario';
  }

  getProgressColor(pct: number): string {
    return pct >= 80 ? '#43a047' : pct >= 40 ? '#fb8c00' : '#e53935';
  }
}
