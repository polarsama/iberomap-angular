import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../../../../services/auth.service';
import { RoleChipComponent } from '../../../../../components/shared/role-chip/role-chip.component';
import { StatCardComponent } from '../../../../../components/shared/stat-card/stat-card.component';
import { SectionTitleComponent } from '../../../../../components/shared/section-title/section-title.component';
import { CardComponent } from '../../../../../components/shared/card/card.component';
import { StatusChipComponent } from '../../../../../components/shared/status-chip/status-chip.component';
import { BtnComponent } from '../../../../../components/shared/btn/btn.component';

@Component({
  selector: 'app-docente-programas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RoleChipComponent,
    StatCardComponent,
    SectionTitleComponent,
    CardComponent,
    StatusChipComponent,
    BtnComponent
  ],
  templateUrl: './docente-programas.component.html',
  styleUrls: ['./docente-programas.component.css']
})
export class DocenteProgramasComponent implements OnInit {
  user: User | null = null;
  selectedProgram: any = null;
  currentView: 'programs' | 'conditions' = 'programs';

  DOCENTE_PROGRAMS = [
    { id: 1, name: 'Ingeniería de Sistemas',     faculty: 'Ingeniería',           pct: 78, pending: 3, collaborators: 12 },
    { id: 2, name: 'Ingeniería Industrial',      faculty: 'Ingeniería',           pct: 45, pending: 2, collaborators: 8 },
  ];

  MY_CHARS: any[] = [
    { num: '1.2', factor: 'Factor 1 — Misión y PEP', name: 'Proyecto Educativo del Programa (PEP)', status: 'en progreso', dueDate: '2025-06-15', shared: 3 },
    { num: '3.1', factor: 'Factor 3 — Profesores', name: 'Selección, vinculación y permanencia de profesores', status: 'pendiente', dueDate: '2025-06-20', shared: 1 },
    { num: '3.3', factor: 'Factor 3 — Profesores', name: 'Número, dedicación y nivel de formación de profesores', status: 'pendiente', dueDate: '2025-06-20', shared: 1 },
    { num: '4.4', factor: 'Factor 4 — Procesos Académicos', name: 'Metodologías de enseñanza y aprendizaje', status: 'completado', dueDate: '2025-05-30', shared: 5, 
      condicion: 'Metodologías', descripcion: 'Se implementan diversas metodologías de enseñanza y aprendizaje.', factorFull: 'Factor 4: Comunidad de egresados.', caracFull: 'C18: Coherencia de las estrategias pedagógicas con el proyecto educativo del programa académico y las características de la comunidad de estudiantes.', comentarios: 'Sin comentarios adicionales.' },
    { num: '6.1', factor: 'Factor 6 — Investigación', name: 'Grupos y líneas de investigación del programa', status: 'completado', dueDate: '2025-05-28', shared: 2,
      condicion: 'Grupos de investigación', descripcion: 'El programa cuenta con grupos de investigación categorizados.', factorFull: 'Factor 6: Permanencia y graduación.', caracFull: 'C30: Capacidades y procesos para la consolidación de la investigación, el desarrollo tecnológico, la innovación, la creación e investigación-creación artística y cultural en el programa académico.', comentarios: '' },
  ];

  pending = 0;
  done = 0;
  confirmDeleteData: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    this.pending = this.MY_CHARS.filter(c => c.status !== 'completado').length;
    this.done = this.MY_CHARS.filter(c => c.status === 'completado').length;
  }

  getUserFirstName(): string {
    return this.user?.name ? this.user.name.split(' ')[0] : 'Docente';
  }

  goToConditions(program: any) {
    this.selectedProgram = program;
    this.currentView = 'conditions';
  }

  goToDiligenciarCondicion(char: any) {
    this.router.navigate(['/dashboard/docente/diligenciar-condicion'], {
      queryParams: {
        programId: this.selectedProgram?.id,
        programName: this.selectedProgram?.name,
        charNum: char.num,
        charName: char.name,
        charStatus: char.status,
        factor: char.factor
      }
    });
  }

  addNewCondition() {
    this.router.navigate(['/dashboard/docente/diligenciar-condicion'], {
      queryParams: {
        programId: this.selectedProgram?.id,
        programName: this.selectedProgram?.name,
        charNum: '',
        charName: 'Nueva Condición',
        charStatus: 'pendiente',
        factor: ''
      }
    });
  }

  goBack() {
    if (this.currentView === 'conditions') {
      this.currentView = 'programs';
      this.selectedProgram = null;
    }
  }

  deleteChar(char: any) {
    this.confirmDeleteData = { type: 'char', char };
  }

  executeDelete() {
    if (!this.confirmDeleteData) return;

    if (this.confirmDeleteData.type === 'char') {
      this.MY_CHARS = this.MY_CHARS.filter(c => c !== this.confirmDeleteData.char);
      this.done = this.MY_CHARS.filter(c => c.status === 'completado').length;
      this.pending = this.MY_CHARS.filter(c => c.status !== 'completado').length;
    }

    this.confirmDeleteData = null;
  }
}
