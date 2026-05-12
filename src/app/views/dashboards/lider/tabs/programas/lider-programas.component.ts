import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LiderDataService } from '../../../../../services/lider-data.service';
import { CardComponent } from '../../../../../components/shared/card/card.component';
import { SectionTitleComponent } from '../../../../../components/shared/section-title/section-title.component';
import { StatusChipComponent } from '../../../../../components/shared/status-chip/status-chip.component';
import { BtnComponent } from '../../../../../components/shared/btn/btn.component';
import { ConfirmModalComponent } from '../../../../../components/shared/confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lider-programas',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, SectionTitleComponent, StatusChipComponent, BtnComponent, ConfirmModalComponent],
  templateUrl: './lider-programas.component.html',
  styleUrls: ['../../lider-dashboard.component.css'] // Reuse dashboard styles
})
export class LiderProgramasComponent implements OnInit {
  programs: any[] = [];
  filters = { name: '', faculty: '', type: '', status: '' };
  facultiesList = ['Ingeniería', 'Ciencias Humanas', 'Ciencias Empresariales', 'Ciencias de la Salud', 'Ciencias Jurídicas'];
  typesList = ['Renovación', 'Acreditación', 'Autoevaluación'];
  statusList = ['no iniciado', 'en progreso', 'completado'];

  stats = { completed: 0, inProgress: 0, notStarted: 0, avgPct: 0 };
  
  showModal = false;
  newProgram: any = { id: null, name: '', snies: '', faculty: '', type: 'Renovación' };
  
  docentesList: any[] = [];
  selectedDocenteId: number | null = null;
  
  selectedProgramDetail: any = null;
  confirmDeleteData: any = null;
  showAssign: any = null;

  constructor(private dataService: LiderDataService, private router: Router) {}

  ngOnInit() {
    this.dataService.programs$.subscribe(p => {
      this.programs = p;
      this.calculateStats();
    });

    this.dataService.users$.subscribe(u => {
      this.docentesList = u.filter(user => user.role === 'docente');
    });
  }

  get filteredPrograms() {
    return this.programs.filter(p => {
      const matchName = p.name.toLowerCase().includes(this.filters.name.toLowerCase());
      const matchFaculty = !this.filters.faculty || p.faculty === this.filters.faculty;
      const matchType = !this.filters.type || p.type === this.filters.type;
      const matchStatus = !this.filters.status || p.status === this.filters.status;
      return matchName && matchFaculty && matchType && matchStatus;
    });
  }

  calculateStats() {
    this.stats.completed = this.programs.filter(p => p.status === 'completado').length;
    this.stats.inProgress = this.programs.filter(p => p.status === 'en progreso').length;
    this.stats.notStarted = this.programs.filter(p => p.status === 'no iniciado').length;
    const totalPct = this.programs.reduce((acc, p) => acc + this.getProgramProgress(p), 0);
    this.stats.avgPct = this.programs.length > 0 ? Math.round(totalPct / this.programs.length) : 0;
  }

  getProgramProgress(p: any): number {
    if (!p.conditionsTotal) return 0;
    return Math.round((p.conditionsCompleted / p.conditionsTotal) * 100);
  }

  getProgressColor(pct: number): string {
    return pct >= 80 ? '#43a047' : pct >= 40 ? '#fb8c00' : '#e53935';
  }

  openNewProgramModal() {
    this.newProgram = { id: null, name: '', snies: '', faculty: '', type: 'Renovación' };
    this.showModal = true;
  }

  editProgram(p: any) {
    this.newProgram = { ...p };
    this.showModal = true;
  }

  viewConditions(p: any) {
    this.router.navigate(['/dashboard/lider/programas', p.id, 'condiciones']);
  }

  saveNewProgram() {
    this.dataService.saveProgram(this.newProgram);
    this.showModal = false;
  }

  assignDocente() {
    if (!this.selectedDocenteId || !this.showAssign) return;
    
    const docente = this.docentesList.find(d => d.id === Number(this.selectedDocenteId));
    if (docente) {
      if (!this.showAssign.collaborators) this.showAssign.collaborators = [];
      
      // Check if already assigned
      if (!this.showAssign.collaborators.find((c: any) => c.id === docente.id)) {
        this.showAssign.collaborators.push({
          id: docente.id,
          name: docente.name,
          initials: docente.name.split(' ').map((n: any) => n[0]).join('').toUpperCase(),
          email: docente.email
        });
        this.showAssign.docentes = this.showAssign.collaborators.length;
        this.dataService.saveProgram(this.showAssign);
      }
    }
    this.showAssign = null;
    this.selectedDocenteId = null;
  }

  deleteProgram(id: number) {
    this.confirmDeleteData = { type: 'program', id };
  }

  executeDelete() {
    if (this.confirmDeleteData.type === 'program') {
      this.dataService.deleteProgram(this.confirmDeleteData.id);
    }
    this.confirmDeleteData = null;
  }
}
