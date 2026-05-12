import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { NavBarComponent } from '../../../components/shared/nav-bar/nav-bar.component';

import { RouterModule } from '@angular/router';
import { RoleChipComponent } from '../../../components/shared/role-chip/role-chip.component';

@Component({
  selector: 'app-decano-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavBarComponent,
    RoleChipComponent
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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    if (!this.user || this.user.role !== 'decano') {
      this.router.navigate(['/login']);
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  setTab(tabId: string) {
    this.activeTab = tabId;
    if (tabId === 'dashboard') {
      this.router.navigate(['/dashboard/decano/resumen']);
    } else {
      this.router.navigate([`/dashboard/decano/${tabId}`]);
    }
  }

  getUserFirstName(): string {
    return this.user?.name ? this.user.name.split(' ')[0] : 'Usuario';
  }
}
