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
import { ProgressRowComponent } from '../../../components/shared/progress-row/progress-row.component';

@Component({
  selector: 'app-decano-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent,
    RoleChipComponent,
    StatCardComponent,
    SectionTitleComponent,
    CardComponent,
    StatusChipComponent,
    ProgressRowComponent
  ],
  templateUrl: './decano-dashboard.component.html',
  styleUrls: ['./decano-dashboard.component.css']
})
export class DecanoDashboardComponent implements OnInit {
  user: User | null = null;
  activeTab = 'dashboard';

  navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'programas', label: 'Programas', icon: 'list' },
    { id: 'reportes',  label: 'Reportes',  icon: 'bar_chart' },
  ];

  programs = [
    { name: 'Ingeniería de Sistemas',    type: 'Renovación',     status: 'en progreso', pct: 78 },
    { name: 'Ingeniería Industrial',     type: 'Autoevaluación', status: 'en progreso', pct: 45 },
    { name: 'Ingeniería Electrónica',    type: 'Renovación',     status: 'no iniciado', pct: 8  },
  ];

  completedChars = 0;
  totalChars = 0;
  avgPct = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    if (!this.user || this.user.role !== 'decano') {
      this.router.navigate(['/login']);
    }

    this.totalChars = 41 * this.programs.length;
    this.completedChars = this.programs.reduce((a, p) => a + Math.round(41 * p.pct / 100), 0);
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

  getBarHeight(pct: number): string {
    return Math.max(8, (pct / 100) * 130) + 'px';
  }

  getProgressColor(pct: number): string {
    return pct >= 80 ? '#43a047' : pct >= 40 ? '#fb8c00' : '#e53935';
  }

  getShortName(name: string): string {
    return name.split(' ').slice(0, 2).join(' ');
  }
}
