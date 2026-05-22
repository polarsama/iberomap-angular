import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../../services/auth.service';
import { NavBarComponent } from '../../../../components/shared/nav-bar/nav-bar.component';
import { Faculty, Program, Condition, DynamicField, CatalogOption } from '../../../../core/models/registro-calificado.model';
import { DynamicFormEngineComponent } from '../../components/form-engine/form-engine.component';

@Component({
  selector: 'app-condition-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicFormEngineComponent, NavBarComponent],
  templateUrl: './condition-manager.component.html',
  styleUrls: ['./condition-manager.component.css']
})
export class ConditionManagerComponent implements OnInit {
  user: User | null = null;
  activeTab = 'registro-calificado';

  navItems = [
    { id: 'mis-chars', label: 'Mis Programas', icon: 'folder' },
    { id: 'registro-calificado', label: 'Registro Calificado', icon: 'architecture' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  setTab(tabId: string) {
    this.activeTab = tabId;
    if (tabId === 'mis-chars') {
      this.router.navigate(['/dashboard/docente']);
    }
  }

  // Datos maestros (simulados por ahora)
  faculties: Faculty[] = [
    { id: 'f1', nombre: 'Facultad de Ingeniería', decano: 'Dr. Perez', institutionId: 'i1' },
    { id: 'f2', nombre: 'Facultad de Ciencias Humanas', decano: 'Dra. Gomez', institutionId: 'i1' }
  ];

  programs: Program[] = [
    { id: 'p1', facultyId: 'f1', nombre: 'Ingeniería Industrial', snies: '107162', modalidad: 'Virtual', creditos: 160 },
    { id: 'p2', facultyId: 'f1', nombre: 'Ingeniería de Software', snies: '202345', modalidad: 'Presencial', creditos: 155 }
  ];

  conditions: Condition[] = [
    { id: 'c1', programId: 'p1', numero: 1, nombre: 'Denominación del Programa', version: '1.0', estado: 'Pendiente' },
    { id: 'c2', programId: 'p1', numero: 2, nombre: 'Justificación', version: '1.0', estado: 'En Proceso' }
  ];

  // Filtros seleccionados
  selectedFacultyId: string = '';
  selectedProgramId: string = '';
  selectedConditionId: string = '';

  // Datos para el motor dinámico
  currentFields: DynamicField[] = [];
  catalogs: { [key: string]: CatalogOption[] } = {
    'factor': [
      { id: 'cat1', label: 'Factor 1: Docentes', value: 'F1' },
      { id: 'cat2', label: 'Factor 2: Estudiantes', value: 'F2' }
    ],
    'caracteristica': [
      { id: 'cat3', label: 'Característica 1.1: Selección', value: 'C1.1' }
    ]
  };

  filteredPrograms: Program[] = [];
  filteredConditions: Condition[] = [];


  onFacultyChange(): void {
    this.filteredPrograms = this.programs.filter(p => p.facultyId === this.selectedFacultyId);
    this.selectedProgramId = '';
    this.selectedConditionId = '';
    this.currentFields = [];
  }

  onProgramChange(): void {
    this.filteredConditions = this.conditions.filter(c => c.programId === this.selectedProgramId);
    this.selectedConditionId = '';
    this.currentFields = [];
  }

  loadCondition(): void {
    if (!this.selectedConditionId) return;

    // Simulación de carga de metadatos desde API
    this.currentFields = [
      {
        id: 'f_1',
        conditionId: this.selectedConditionId,
        tipoControl: 'text',
        key: 'nombre_programa_meta',
        label: 'Nombre del Programa (Validado)',
        valor: 'Ingeniería Industrial',
        seccion: 'General',
        orden: 1,
        requerido: true
      },
      {
        id: 'f_2',
        conditionId: this.selectedConditionId,
        tipoControl: 'select',
        key: 'factor',
        label: 'Factor Asociado',
        valor: '',
        seccion: 'Calidad',
        orden: 2,
        requerido: true
      },
      {
        id: 'f_3',
        conditionId: this.selectedConditionId,
        tipoControl: 'textarea',
        key: 'justificacion_txt',
        label: 'Resumen de Justificación',
        valor: '',
        seccion: 'Contenido',
        orden: 3,
        requerido: false
      },
      {
        id: 'f_4',
        conditionId: this.selectedConditionId,
        tipoControl: 'table',
        key: 'competencias_tabla',
        label: 'Matriz de Competencias',
        valor: [],
        seccion: 'Académico',
        orden: 4,
        requerido: true,
        config: { columns: ['codigo', 'descripcion', 'nivel'] }
      },
      {
        id: 'f_5',
        conditionId: this.selectedConditionId,
        tipoControl: 'file',
        key: 'soporte_legal',
        label: 'Acta de Aprobación (PDF)',
        valor: null,
        seccion: 'Soportes',
        orden: 5,
        requerido: true
      }
    ];
  }

  handleFormSave(data: any): void {
    console.log('Enviando datos al servidor:', {
      conditionId: this.selectedConditionId,
      programId: this.selectedProgramId,
      formData: data
    });
    alert('¡Condición guardada exitosamente en el sistema SIAC!');
  }
}
