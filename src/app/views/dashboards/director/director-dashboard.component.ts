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
  selector: 'app-director-dashboard',
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
  templateUrl: './director-dashboard.component.html',
  styleUrls: ['./director-dashboard.component.css']
})
export class DirectorDashboardComponent implements OnInit {
  user: User | null = null;
  activeTab = 'factores';
  openFactor: number | null = 1;
  showReuse = false;

  navItems = [
    { id: 'factores',  label: 'Factores MAP', icon: 'assignment' },
    { id: 'avance',    label: 'Mi avance',    icon: 'bar_chart' },
    { id: 'reutilizar',label: 'Reutilizar',   icon: 'content_copy' },
  ];

  FACTORS = [
    { num: 1,  name: 'Misión y Proyecto Educativo del Programa', chars: [
      { num: '1.1', name: 'Misión institucional y del programa', status: 'completado', autor: 'Carlos Ruiz', collabs: 2 },
      { num: '1.2', name: 'Proyecto Educativo del Programa (PEP)', status: 'en progreso', autor: 'Ana Patiño', collabs: 1 },
      { num: '1.3', name: 'Relevancia académica y pertinencia social', status: 'completado', autor: 'Felipe Quintero', collabs: 3 },
      { num: '1.4', name: 'Selección y evaluación de estudiantes', status: 'pendiente' },
    ]},
    { num: 2, name: 'Estudiantes', chars: [
      { num: '2.1', name: 'Deberes y derechos de los estudiantes', status: 'completado', autor: 'Carlos Ruiz', collabs: 0 },
      { num: '2.2', name: 'Admisión y permanencia estudiantil', status: 'en progreso', autor: 'Ana Patiño', collabs: 2 },
      { num: '2.3', name: 'Sistemas de estímulos y créditos', status: 'pendiente' },
    ]},
    { num: 3, name: 'Profesores', chars: [
      { num: '3.1', name: 'Selección, vinculación y permanencia', status: 'pendiente' },
      { num: '3.2', name: 'Estatuto profesoral', status: 'pendiente' },
      { num: '3.3', name: 'Número, dedicación y nivel de formación', status: 'pendiente' },
    ]},
    // More factors could be added here
    { num: 12, name: 'Autoevaluación y Autorregulación', chars: [
      { num: '12.1', name: 'Sistemas de autoevaluación', status: 'pendiente' },
      { num: '12.2', name: 'Resultados y mejoramiento continuo', status: 'pendiente' },
    ]},
  ];

  reuseSuggestions = [
    { car: '1.1 Misión institucional', from: 'Ingeniería Industrial', autor: 'María Rojas', date: '12 Mar 2026' },
    { car: '7.1 Políticas de bienestar', from: 'Ingeniería Electrónica', autor: 'Pablo Mora', date: '03 Feb 2026' },
    { car: '10.1 Recursos físicos', from: 'Ingeniería Industrial', autor: 'María Rojas', date: '28 Ene 2026' },
  ];

  allChars: any[] = [];
  completedCount = 0;
  inProgressCount = 0;
  pct = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    if (!this.user || this.user.role !== 'director') {
      this.router.navigate(['/login']);
    }

    this.allChars = this.FACTORS.flatMap(f => f.chars);
    this.completedCount = this.allChars.filter(c => c.status === 'completado').length;
    this.inProgressCount = this.allChars.filter(c => c.status === 'en progreso').length;
    this.pct = Math.round((this.completedCount + this.inProgressCount * 0.5) / this.allChars.length * 100);
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

  toggleFactor(num: number) {
    this.openFactor = this.openFactor === num ? null : num;
  }

  getDoneCount(factor: any): number {
    return factor.chars.filter((c: any) => c.status === 'completado').length;
  }
}
