import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { NavBarComponent } from '../../../components/shared/nav-bar/nav-bar.component';
import { GeneralData, CurricularCore, Annex, CompetencyRow } from './docente-v2.model';

@Component({
  selector: 'app-docente-v2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent],
  templateUrl: './docente-v2.component.html',
  styleUrls: ['./docente-v2.component.css']
})
export class DocenteV2Component implements OnInit {
  docenteForm!: FormGroup;
  currentStep = 1;
  totalSteps = 5;
  user: User | null = null;
  activeTab = 'docente-v2';

  navItems = [
    { id: 'mis-chars', label: 'Mis Programas', icon: 'folder' },
    { id: 'docente-v2', label: 'Docente V2', icon: 'assignment' },
    { id: 'registro-calificado', label: 'Registro Calificado', icon: 'architecture' },
  ];

  public factores: any[] = [
    { id: 'f1', nombre: 'Factor 1: Docentes' },
    { id: 'f2', nombre: 'Factor 2: Estudiantes' },
    { id: 'f3', nombre: 'Factor 3: Procesos Académicos' }
  ];

  public caracteristicas: any[] = [
    { id: 'c1', nombre: 'Característica 1.1: Selección y Vinculación' },
    { id: 'c2', nombre: 'Característica 1.2: Evaluación' },
    { id: 'c3', nombre: 'Característica 2.1: Participación' }
  ];

  public anexosObligatorios: string[] = [
    'Documento de Denominación del Programa',
    'Justificación de la Modalidad Virtual',
    'Plan de Estudios y Créditos Académicos',
    'Perfil del Egresado y Resultados de Aprendizaje',
    'Actas de Consejo de Facultad'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.initForm();
    this.calculateAllPercentages();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  setTab(tabId: string) {
    this.activeTab = tabId;
    if (tabId === 'mis-chars') {
      this.router.navigate(['/dashboard/docente']);
    } else if (tabId === 'registro-calificado') {
      this.router.navigate(['/dashboard/registro-calificado']);
    }
  }

  initForm(): void {
    this.docenteForm = this.fb.group({
      generalData: this.fb.group({
        sniesInstitucion: [{ value: '2830', disabled: true }],
        nombreInstitucion: [{ value: 'Corporación Universitaria Iberoamericana', disabled: true }],
        nombrePrograma: [{ value: 'Ingeniería Industrial', disabled: true }],
        normaInternaCreacion: ['Resolución 458 de 1 septiembre de 2017', Validators.required],
        tituloOtorgar: ['Ingeniero Industrial', Validators.required],
        facultad: ['Ingeniería', Validators.required],
        campoAmplio: ['Ingeniería, industria y construcción', Validators.required],
        campoEspecifico: ['Ingeniería y profesiones afines', Validators.required],
        campoDetallado: ['Ingeniería y profesiones afines no clasificadas en otra parte', Validators.required],
        nivelAcademico: ['Pregrado Universitaria', Validators.required],
        cupoEstudiantes: ['90 por cohorte', Validators.required],
        requisitosIdioma: ['6 niveles de idioma extranjero', Validators.required],
        modalidad: ['Virtual', Validators.required],
        porcentajeTecnologia: ['100%', Validators.required],
        numeroCreditos: [160, [Validators.required, Validators.min(1)]],
        periodicidadAdmision: ['Semestral', Validators.required],
        duracionPrograma: ['Nueve (9) semestres', Validators.required],
        ubicacion: ['Bogotá DC / Bogotá DC', Validators.required],
        direccionDomicilio: ['Calle 67 número 5-27', Validators.required],
        valorMatricula: ['3.389.100', Validators.required],
        email: ['SIAC@ibero.edu.co', [Validators.required, Validators.email]]
      }),
      coherencia: this.fb.group({
        definicionACOFI: ['', Validators.required],
        definicionIISE: ['', Validators.required],
        factor: ['', Validators.required],
        caracteristica: ['', Validators.required],
        competencias: this.fb.array([this.createCompetencyGroup()])
      }),
      organizacion: this.fb.group({
        perfilProfesional: ['', Validators.required],
        nucleosCurriculares: this.fb.array([
          this.createNucleoGroup('Formación IBERO', 5, 10),
          this.createNucleoGroup('Formación para la Vida', 13, 35),
          this.createNucleoGroup('Formación para la Transformación Social y Digital', 6, 17),
          this.createNucleoGroup('Formación para la Transformación Profesional', 37, 98)
        ])
      }),
      anexos: this.fb.array(this.anexosObligatorios.map(a => this.createAnnexGroup(a)))
    });
  }

  createCompetencyGroup(): FormGroup {
    return this.fb.group({
      campoConocimiento: ['0719 - Ingeniería y profesiones afines no clasificadas en otra parte', Validators.required],
      resultadosAprendizaje: ['', Validators.required],
      competenciasGenerales: ['', Validators.required]
    });
  }

  createNucleoGroup(nombre: string, modulos: number, creditos: number): FormGroup {
    const group = this.fb.group({
      nombre: [nombre, Validators.required],
      modulos: [modulos, [Validators.required, Validators.min(0)]],
      creditos: [creditos, [Validators.required, Validators.min(0)]],
      porcentaje: [{ value: 0, disabled: true }]
    });

    group.get('creditos')?.valueChanges.subscribe(() => {
      this.calculatePercentage(group);
    });

    return group;
  }

  createAnnexGroup(nombre: string): FormGroup {
    return this.fb.group({
      nombre: [nombre],
      archivo: [null, Validators.required],
      status: ['Pendiente'] // Pendiente, Cargado
    });
  }

  // Getters for FormArrays
  get nucleos(): FormArray {
    return this.docenteForm.get('organizacion.nucleosCurriculares') as FormArray;
  }

  get competencias(): FormArray {
    return this.docenteForm.get('coherencia.competencias') as FormArray;
  }

  get anexos(): FormArray {
    return this.docenteForm.get('anexos') as FormArray;
  }

  // Logic
  calculatePercentage(group: FormGroup): void {
    const creditos = group.get('creditos')?.value || 0;
    const total = 160;
    const porcentaje = (creditos / total) * 100;
    group.get('porcentaje')?.setValue(porcentaje.toFixed(2), { emitEvent: false });
  }

  calculateAllPercentages(): void {
    this.nucleos.controls.forEach(control => {
      this.calculatePercentage(control as FormGroup);
    });
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  setStep(step: number): void {
    this.currentStep = step;
  }

  onFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo supera el límite de 10MB');
        return;
      }
      
      const annexGroup = this.anexos.at(index) as FormGroup;
      annexGroup.patchValue({
        archivo: file,
        status: 'Cargado'
      });
    }
  }

  onSubmit(): void {
    if (this.docenteForm.valid) {
      console.log('Formulario enviado:', this.docenteForm.getRawValue());
      alert('Información guardada y enviada al SIAC exitosamente.');
    }
  }
}
