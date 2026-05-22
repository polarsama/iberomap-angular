import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { NavBarComponent } from '../../../components/shared/nav-bar/nav-bar.component';

@Component({
  selector: 'app-docente-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavBarComponent
  ],
  templateUrl: './docente-dashboard.component.html',
  styleUrls: ['./docente-dashboard.component.css']
})
export class DocenteDashboardComponent implements OnInit {
  user: User | null = null;
  activeTab = 'mis-chars';

  navItems = [
    { id: 'mis-chars', label: 'Mis Programas', icon: 'folder' },
    { id: 'registro-calificado', label: 'Registro Calificado', icon: 'architecture' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    if (!this.user || this.user.role !== 'docente') {
      this.router.navigate(['/login']);
    }

    // Default to children route 'programas' if at root docente path
    if (this.router.url === '/dashboard/docente') {
      this.router.navigate(['/dashboard/docente/programas']);
    }

    // Sync active tab
    if (this.router.url.includes('registro-calificado')) {
      this.activeTab = 'registro-calificado';
    } else {
      this.activeTab = 'mis-chars';
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  setTab(tabId: string) {
    this.activeTab = tabId;
    if (tabId === 'registro-calificado') {
      this.router.navigate(['/dashboard/docente/registro-calificado']);
    } else if (tabId === 'mis-chars') {
      this.router.navigate(['/dashboard/docente/programas']);
    }
  }
}
