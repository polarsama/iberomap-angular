import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
    BtnComponent,
    FormsModule
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
    { id: 1, name: 'Ingeniería de Sistemas', faculty: 'Ingeniería', type: 'Renovación',     status: 'en progreso', snies: '12345', docentes: 2, conditionsTotal: 51, conditionsCompleted: 40, collaborators: [{id: 1, name: 'Carlos Ruiz', initials: 'CR', email: 'carlos.ruiz@ibero.edu.co'}, {id: 2, name: 'Ana Patiño', initials: 'AP', email: 'ana.patino@ibero.edu.co'}] },
    { id: 2, name: 'Psicología',             faculty: 'Ciencias Humanas', type: 'Acreditación', status: 'completado',  snies: '23456', docentes: 2, conditionsTotal: 51, conditionsCompleted: 51, collaborators: [{id: 3, name: 'Laura Gómez', initials: 'LG', email: 'laura.gomez@ibero.edu.co'}, {id: 4, name: 'Pablo Mora', initials: 'PM', email: 'pablo.mora@ibero.edu.co'}] },
    { id: 3, name: 'Administración de Emp.', faculty: 'Ciencias Empresariales', type: 'Renovación', status: 'en progreso', snies: '34567', docentes: 1, conditionsTotal: 51, conditionsCompleted: 28, collaborators: [{id: 1, name: 'Carlos Ruiz', initials: 'CR', email: 'carlos.ruiz@ibero.edu.co'}] },
    { id: 4, name: 'Derecho',                faculty: 'Ciencias Jurídicas', type: 'Autoevaluación', status: 'no iniciado', snies: '45678', docentes: 0, conditionsTotal: 51, conditionsCompleted: 0, collaborators: [] },
    { id: 5, name: 'Contaduría Pública',     faculty: 'Ciencias Empresariales', type: 'Renovación', status: 'en progreso', snies: '56789', docentes: 1, conditionsTotal: 51, conditionsCompleted: 21, collaborators: [{id: 2, name: 'Ana Patiño', initials: 'AP', email: 'ana.patino@ibero.edu.co'}] },
    { id: 6, name: 'Medicina',               faculty: 'Ciencias de la Salud', type: 'Acreditación', status: 'completado', snies: '67890', docentes: 3, conditionsTotal: 51, conditionsCompleted: 45, collaborators: [{id: 1, name: 'Carlos Ruiz', initials: 'CR', email: 'carlos.ruiz@ibero.edu.co'}, {id: 2, name: 'Ana Patiño', initials: 'AP', email: 'ana.patino@ibero.edu.co'}, {id: 5, name: 'Felipe Quintero', initials: 'FQ', email: 'felipe.q@ibero.edu.co'}] },
    { id: 7, name: 'Enfermería',             faculty: 'Ciencias de la Salud', type: 'Renovación', status: 'no iniciado', snies: '78901', docentes: 0, conditionsTotal: 51, conditionsCompleted: 2, collaborators: [] },
  ];

  filters = {
    name: '',
    faculty: '',
    type: '',
    status: ''
  };

  completed = 0;
  inProgress = 0;
  notStarted = 0;
  avgPct = 0;

  users = [
    { id: 1, name: 'Carlos Ruiz', email: 'carlos.ruiz@ibero.edu.co', role: 'docente', status: 'activo' },
    { id: 2, name: 'Ana Patiño', email: 'ana.patino@ibero.edu.co', role: 'docente', status: 'activo' },
    { id: 3, name: 'Laura Gómez', email: 'laura.gomez@ibero.edu.co', role: 'director', status: 'activo' },
    { id: 4, name: 'Pablo Mora', email: 'pablo.mora@ibero.edu.co', role: 'director', status: 'activo' },
    { id: 5, name: 'Felipe Quintero', email: 'felipe.q@ibero.edu.co', role: 'decano', status: 'activo' },
  ];

  facultiesList = ['Ingeniería', 'Ciencias Humanas', 'Ciencias Empresariales', 'Ciencias de la Salud', 'Ciencias Jurídicas'];
  typesList = ['Renovación', 'Acreditación', 'Autoevaluación'];
  statusList = ['no iniciado', 'en progreso', 'completado'];

  faculties = [
    { name: 'Ingeniería', programs: 12, pct: 65 },
    { name: 'Ciencias Humanas', programs: 8, pct: 42 },
    { name: 'Ciencias Empresariales', programs: 15, pct: 58 },
    { name: 'Ciencias de la Salud', programs: 10, pct: 81 },
    { name: 'Ciencias Jurídicas', programs: 5, pct: 30 },
  ];

  newProgram: any = {
    id: null,
    name: '',
    snies: '',
    faculty: '',
    type: 'Renovación'
  };

  selectedProgramDetail: any = null;
  confirmDeleteData: any = null; // Para el modal de confirmación

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    if (!this.user || this.user.role !== 'lider') {
      this.router.navigate(['/login']);
    }

    this.calculateStats();
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
    this.completed = this.programs.filter(p => p.status === 'completado').length;
    this.inProgress = this.programs.filter(p => p.status === 'en progreso').length;
    this.notStarted = this.programs.filter(p => p.status === 'no iniciado').length;
    
    const totalPct = this.programs.reduce((acc, p) => acc + this.getProgramProgress(p), 0);
    this.avgPct = this.programs.length > 0 ? Math.round(totalPct / this.programs.length) : 0;
  }

  getProgramProgress(p: any): number {
    if (!p.conditionsTotal) return 0;
    return Math.round((p.conditionsCompleted / p.conditionsTotal) * 100);
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

  openNewProgramModal() {
    this.newProgram = { id: null, name: '', snies: '', faculty: '', type: 'Renovación' };
    this.showModal = true;
  }

  editProgram(p: any) {
    this.newProgram = { ...p };
    this.showModal = true;
  }

  viewProgram(p: any) {
    this.selectedProgramDetail = p;
  }

  saveNewProgram() {
    if (!this.newProgram.name || !this.newProgram.snies || !this.newProgram.faculty) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (this.newProgram.id) {
      const idx = this.programs.findIndex(p => p.id === this.newProgram.id);
      if (idx !== -1) {
        this.programs[idx] = { ...this.newProgram };
      }
    } else {
      this.programs.unshift({
        ...this.newProgram,
        id: Date.now(),
        status: 'no iniciado',
        docentes: 0,
        conditionsTotal: 51,
        conditionsCompleted: 0,
        collaborators: []
      });
    }

    this.calculateStats();
    this.showModal = false;
  }

  deleteProgram(id: number) {
    this.confirmDeleteData = { type: 'program', id };
  }

  confirmRemoveCollaborator(docente: any) {
    this.confirmDeleteData = { type: 'collaborator', docente, program: this.showAssign };
  }

  executeDelete() {
    if (!this.confirmDeleteData) return;

    if (this.confirmDeleteData.type === 'program') {
      this.programs = this.programs.filter(p => p.id !== this.confirmDeleteData.id);
    } else if (this.confirmDeleteData.type === 'collaborator') {
      const program = this.confirmDeleteData.program;
      if (program && program.collaborators) {
        program.collaborators = program.collaborators.filter((c: any) => c.id !== this.confirmDeleteData.docente.id);
        program.docentes = program.collaborators.length;
      }
    }

    this.calculateStats();
    this.confirmDeleteData = null;
  }

  removeCollaborator(docenteId: number) {
    if (confirm('¿Estás seguro de retirar a este docente del programa?')) {
      // Logic would go here to update the list
      if (this.showAssign) {
        this.showAssign.docentes--;
      }
    }
  }

  exportToExcel() {
    let headers: string[] = [];
    let csvData = '';
    let filename = 'reporte';

    if (this.activeTab === 'usuarios') {
      headers = ['Usuario', 'Correo', 'Rol MAP', 'Estado'];
      csvData = this.users.map(u => `"${u.name}","${u.email}","${u.role}","${u.status}"`).join('\n');
      filename = 'reporte_usuarios_ibero';
    } else if (this.activeTab === 'reportes') {
      headers = ['Facultad', 'Programas', 'Avance General'];
      csvData = this.faculties.map(f => `"${f.name}","${f.programs}","${f.pct}%"`).join('\n');
      filename = 'reporte_gestion_facultades';
    } else {
      headers = ['Programa', 'Facultad', 'Tipo', 'Estado', 'Avance', 'SNIES'];
      csvData = this.programs.map(p => 
        `"${p.name}","${p.faculty}","${p.type}","${p.status}","${this.getProgramProgress(p)}%","${p.snies}"`
      ).join('\n');
      filename = 'reporte_programas_ibero';
    }
    
    const blob = new Blob([headers.join(',') + '\n' + csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToPDF() {
    let title = 'REPORTE DE PROGRAMAS ACADÉMICOS';
    let contentHtml = '';
    let extraStyles = '';

    if (this.activeTab === 'usuarios') {
      title = 'REPORTE DE GESTIÓN DE USUARIOS';
      contentHtml = `
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol MAP</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${this.users.map(u => `
              <tr>
                <td style="font-weight:700">${u.name}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td>${u.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (this.activeTab === 'reportes') {
      title = 'REPORTE DE AVANCE POR FACULTAD';
      contentHtml = `
        <table>
          <thead>
            <tr>
              <th>Facultad</th>
              <th>Total Programas</th>
              <th>Avance General</th>
            </tr>
          </thead>
          <tbody>
            ${this.faculties.map(f => `
              <tr>
                <td style="font-weight:700">${f.name}</td>
                <td>${f.programs}</td>
                <td>
                  <div class="progress-wrapper">
                    <div class="progress-bar"><div class="progress-fill" style="width:${f.pct}%"></div></div>
                    <span class="progress-text">${f.pct}%</span>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      // Dashboard/Programas
      const tableInner = document.querySelector('.table-responsive table')?.innerHTML;
      if (!tableInner) return;
      contentHtml = `<table>${tableInner}</table>`;
      extraStyles = `
        th:nth-child(6), td:nth-child(6),
        th:nth-child(7), td:nth-child(7) { display: none; }
        th:nth-child(1) { width: 35%; }
        th:nth-child(2) { width: 20%; }
      `;
    }

    const windowPrint = window.open('', '', 'width=900,height=900');
    if (!windowPrint) return;

    windowPrint.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page { size: landscape; margin: 20mm; }
            body { font-family: 'Montserrat', sans-serif; padding: 0; color: #222; }
            .header-report { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 3px solid #D0AB4B; padding-bottom: 15px; }
            .header-report h1 { margin: 0; color: #222; font-size: 24px; font-weight: 800; }
            .header-report p { margin: 0; color: #666; font-size: 11px; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; }
            th { background: #222; color: #fff; padding: 12px 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
            td { padding: 12px 10px; border-bottom: 1px solid #EEE; font-size: 11px; word-wrap: break-word; }
            ${extraStyles}
            .progress-wrapper { display: flex; align-items: center; gap: 8px; }
            .progress-bar { flex: 1; height: 8px; background: #EEE; border-radius: 4px; overflow: hidden; }
            .progress-fill { height: 100%; background: #D0AB4B; }
            .progress-text { font-weight: 700; font-size: 10px; }
            .header-filters, .action-buttons, .status-dot { display: none !important; }
          </style>
        </head>
        <body>
          <div class="header-report">
            <h1>${title}</h1>
            <p>Generado por: ${this.user?.name} · ${new Date().toLocaleString()}</p>
          </div>
          ${contentHtml}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 700);
          </script>
        </body>
      </html>
    `);
    windowPrint.document.close();
  }
}
