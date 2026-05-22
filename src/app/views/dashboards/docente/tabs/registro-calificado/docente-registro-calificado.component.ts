import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../../../services/auth.service';
import { Program, Condition, DynamicField, CatalogOption } from '../../../../../core/models/registro-calificado.model';
import { DynamicFormEngineComponent } from '../../../../../features/registro-calificado/components/form-engine/form-engine.component';

@Component({
  selector: 'app-docente-registro-calificado',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicFormEngineComponent],
  templateUrl: './docente-registro-calificado.component.html',
  styleUrls: ['./docente-registro-calificado.component.css']
})
export class DocenteRegistroCalificadoComponent implements OnInit {
  user: User | null = null;
  selectedProgramId: string = '';
  selectedConditionId: string = '';

  // Programas asignados al docente
  programs: Program[] = [
    { id: 'p1', facultyId: 'f1', nombre: 'Ingeniería de Sistemas', snies: '107162', modalidad: 'Virtual', creditos: 160 },
    { id: 'p2', facultyId: 'f1', nombre: 'Ingeniería Industrial', snies: '202345', modalidad: 'Virtual', creditos: 160 }
  ];

  conditions: Condition[] = [
    // Condiciones para Ingeniería de Sistemas (p1)
    { id: 'c1', programId: 'p1', numero: 1.2, nombre: 'Proyecto Educativo del Programa (PEP)', version: '1.0', estado: 'En Proceso' },
    { id: 'c2', programId: 'p1', numero: 3.1, nombre: 'Selección, vinculación y permanencia de profesores', version: '1.0', estado: 'Pendiente' },
    { id: 'c3', programId: 'p1', numero: 3.3, nombre: 'Número, dedicación y nivel de formación de profesores', version: '1.0', estado: 'Pendiente' },
    { id: 'c4', programId: 'p1', numero: 4.4, nombre: 'Metodologías de enseñanza y aprendizaje', version: '1.0', estado: 'Completado' },
    { id: 'c5', programId: 'p1', numero: 6.1, nombre: 'Grupos y líneas de investigación del programa', version: '1.0', estado: 'Completado' },

    // Condiciones para Ingeniería Industrial (p2)
    { id: 'c6', programId: 'p2', numero: 1.2, nombre: 'Proyecto Educativo del Programa (PEP)', version: '1.0', estado: 'En Proceso' },
    { id: 'c7', programId: 'p2', numero: 3.1, nombre: 'Selección, vinculación y permanencia de profesores', version: '1.0', estado: 'Pendiente' },
    { id: 'c8', programId: 'p2', numero: 3.3, nombre: 'Número, dedicación y nivel de formación de profesores', version: '1.0', estado: 'Pendiente' },
    { id: 'c9', programId: 'p2', numero: 4.4, nombre: 'Metodologías de enseñanza y aprendizaje', version: '1.0', estado: 'Completado' },
    { id: 'c10', programId: 'p2', numero: 6.1, nombre: 'Grupos y líneas de investigación del programa', version: '1.0', estado: 'Completado' }
  ];

  filteredConditions: Condition[] = [];

  getSelectedConditionName(): string {
    const cond = this.conditions.find(c => c.id === this.selectedConditionId);
    return cond ? `Condición ${cond.numero}: ${cond.nombre}` : '';
  }

  getSelectedConditionVersion(): string {
    const cond = this.conditions.find(c => c.id === this.selectedConditionId);
    return cond ? cond.version : '1.0';
  }
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

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
  }

  onProgramChange(): void {
    this.filteredConditions = this.conditions.filter(c => c.programId === this.selectedProgramId);
    this.selectedConditionId = '';
    this.currentFields = [];
  }

  loadCondition(): void {
    if (!this.selectedConditionId) return;

    this.currentFields = [
      {
        id: 'f_1',
        conditionId: this.selectedConditionId,
        tipoControl: 'text',
        key: 'nombre_programa_meta',
        label: 'Nombre del Programa (Validado)',
        valor: this.programs.find(p => p.id === this.selectedProgramId)?.nombre || '',
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
