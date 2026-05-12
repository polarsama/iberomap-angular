import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { NavBarComponent } from '../../../components/shared/nav-bar/nav-bar.component';
import { RoleChipComponent } from '../../../components/shared/role-chip/role-chip.component';
import { filter } from 'rxjs/operators';
import { ExportService } from '../../../services/export.service';

@Component({
  selector: 'app-lider-dashboard',
  standalone: true,
  imports: [CommonModule, NavBarComponent, RoleChipComponent, RouterModule],
  templateUrl: './lider-dashboard.component.html',
  styleUrls: ['./lider-dashboard.component.css']
})
export class LiderDashboardComponent implements OnInit {
  user: User | null = null;
  activeTab = 'resumen';

  navItems = [
    { id: 'resumen',  label: 'Dashboard',  icon: 'dashboard' },
    { id: 'programas', label: 'Programas',  icon: 'list' },
    { id: 'reportes',  label: 'Reportes',   icon: 'bar_chart' },
    { id: 'usuarios',  label: 'Usuarios',   icon: 'group' },
  ];

  constructor(
    private authService: AuthService, 
    private router: Router,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    if (!this.user || this.user.role !== 'lider') {
      this.router.navigate(['/login']);
      return;
    }

    this.syncActiveTab();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.syncActiveTab();
    });
  }

  private syncActiveTab() {
    const url = this.router.url;
    if (url.includes('/usuarios')) this.activeTab = 'usuarios';
    else if (url.includes('/reportes')) this.activeTab = 'reportes';
    else if (url.includes('/programas')) this.activeTab = 'programas';
    else this.activeTab = 'resumen';
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  setTab(tabId: string) {
    this.router.navigate(['/dashboard/lider', tabId]);
  }

  getUserFirstName(): string {
    return this.user?.name ? this.user.name.split(' ')[0] : 'Usuario';
  }

  exportToPDF() {
    this.exportService.exportToPDF(this.activeTab);
  }

  exportToExcel() {
    this.exportService.exportToExcel(this.activeTab);
  }
}
