import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User } from '../../../../../services/auth.service';
import { NotificationService } from '../../../../../services/notification.service';

@Component({
  selector: 'app-diligenciar-condicion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './diligenciar-condicion.component.html',
  styleUrls: ['./diligenciar-condicion.component.css']
})
export class DiligenciarCondicionComponent implements OnInit {
  docenteForm!: FormGroup;
  currentStep = 1;
  totalSteps = 5;
  user: User | null = null;

  selectedProgramName = '';
  selectedCharName = '';
  selectedCharNum = '';
  selectedCharStatus = '';
  selectedCharFactor = '';

  factoresList: any[] = [];
  caracteristicasList: any[] = [];

  anexosObligatorios: string[] = [
    'Documento de Denominación del Programa',
    'Justificación de la Modalidad Virtual',
    'Plan de Estudios y Créditos Académicos',
    'Perfil del Egresado y Resultados de Aprendizaje',
    'Actas de Consejo de Facultad'
  ];

  FACTORES = [
    'Factor 1: Proyecto educativo del programa e identidad institucional.',
    'Factor 2: Comunidad de estudiantes.',
    'Factor 3: Comunidad de profesores.',
    'Factor 4: Comunidad de egresados.',
    'Factor 5: Aspectos académicos y evaluación.',
    'Factor 6: Permanencia y graduación.',
    'Factor 7: Proyección e interacción con el entorno.',
    'Factor 8: Aportes de la investigación, la innovación, el desarrollo tecnológico y la creación.',
    'Factor 9: Bienestar de la comunidad académica del programa.',
    'Factor 10: Recursos físicos, tecnológicos, medios educativos y ambientes de aprendizaje.',
    'Factor 11: Organización, administración y financiación del programa académico.',
    'Factor 12: Aseguramiento de la alta calidad del programa.'
  ];

  CARACTERISTICAS = [
    'C1: Proyecto educativo del programa.',
    'C2: Relevancia académica y pertinencia social del programa académico.',
    'C3: Incidencia de las actividades de formación integral.',
    'C4: Orientación, acompañamiento y seguimiento a estudiantes.',
    'C5: Estrategias pedagógicas para el fortalecimiento de la autonomía y el trabajo colaborativo con responsabilidad social.',
    'C6: Políticas académicas y normativas en el proceso formativo en procura de una cultura de paz y tolerancia, el antirracismo, la perspectiva de género y la atención a poblaciones diversas, entre otros.',
    'C7: Estímulos y apoyos para todos los estudiantes and en atención a la diversidad, el pluralismo y la inclusión.',
    'C8: Resultados de los procesos de selección, vinculación y permanencia de los profesores en el mejoramiento del programa.',
    'C9: Estatuto, trayectoria y reconocimiento profesoral.',
    'C10: Planta profesoral para materializar el proyecto educativo del programa.',
    'C11: Capacidades, procesos, y resultados, del desarrollo profesoral del programa en coherencia con el proyecto educativo.',
    'C12: Coherencia entre los estímulos a la trayectoria de los profesores del programa y el proyecto educativo.',
    'C13: Producción, pertinencia, utilización e impacto de material docente.',
    'C14: Evaluación integral de profesores y sus efectos en el mejoramiento del programa.',
    'C15: Seguimiento de los egresados, su caracterización y aportes en el mejoramiento del programa.',
    'C16: Impacto y reconocimientos obtenidos por los egresados en el medio social y el ámbito académico.',
    'C17: Evaluación de la gestión curricular y sus efectos en la mejora del programa desde una perspectiva de integralidad, flexibilidad e interacción de las disciplinas.',
    'C18: Coherencia de las estrategias pedagógicas con el proyecto educativo del programa académico y las características de la comunidad de estudiantes.',
    'C19: Sistema de evaluación de estudiantes en coherencia con las transformaciones en las teorías y métodos de aprendizaje, las dinámicas del contexto y las declaraciones del programa.',
    'C20: Aportes del sistema de evaluación de los procesos y resultados académicos al mejoramiento curricular del programa.',
    'C21: Coherencia entre las competencias, capacidades, habilidades y/o destrezas, los procesos y resultados académicos previstos y demás aspectos curriculares definidos en el proyecto educativo del programa académico.',
    'C22: Impacto de las políticas y estrategias implementadas para la permanencia y la graduación.',
    'C23: Caracterización y atención de estudiantes a través de los sistemas, estrategias y programas dispuestos para tal fin.',
    'C24: Evolución de los ajustes a los aspectos curriculares y pedagógicos como resultado de los programas de permanencia y graduación.',
    'C25: Contribución de los mecanismos de selección a la reducción de la deserción y la graduación oportuna.',
    'C26: Inserción del programa en contextos académicos locales, regionales, nacionales e internacionales.',
    'C27: Resultados y logros de las relaciones y de la cooperación de profesores y estudiantes con comunidades locales, regionales, nacionales y extranjeras y sus efectos en el posicionamiento del programa.',
    'C28: Efectos de las políticas para el desarrollo de habilidades comunicativas en una o varias lenguas en coherencia con el proyecto educativo del programa académico.',
    'C29: Impacto y aportes de la proyección e interacción social en diferentes contextos.',
    'C30: Capacidades y procesos para la consolidación de la investigación, el desarrollo tecnológico, la innovación, la creación e investigación-creación artística y cultural en el programa académico.',
    'C31: Identificación de los resultados, logros e impactos de la investigación, el desarrollo tecnológico, la innovación, la creación e investigación-creación artística y cultural en los diferentes contextos del programa.',
    'C32: Coherencia de las líneas de investigación y/o creación y resultados con el proyecto educativo del programa académico.',
    'C33: Resultados de la formación para la investigación, desarrollo tecnológico, la innovación y la creación.',
    'C34: Demostración del uso de los resultados de investigación, el desarrollo tecnológico, la innovación y/o la creación e investigación-creación artística y cultural en el mejoramiento del programa.',
    'C35: Impacto de la investigación y/o la investigación-creación en el contexto en el que se ofrece el programa.',
    'C36: Evolución y evaluación de los programas y servicios que desarrollan las políticas de bienestar en el marco del pluralismo, la diversidad y la inclusión.',
    'C37: Incidencia de los programas, planes y actividades de bienestar en la formación integral y en la calidad de vida de la comunidad de estudiantes.',
    'C38: Adaptación y evaluación de los programas, actividades e infraestructura de bienestar a las condiciones particulares que determinan la oferta del programa.',
    'C39: Evolución y evaluación de los medios educativos que soportan los ambientes de aprendizaje del programa.',
    'C40: Aporte de los medios educativos en los procesos y resultados académicos de los estudiantes atendiendo su contexto y a los principios rectores de la alta calidad.',
    'C41: Evolución de la suficiencia y calidad de los medios educativos, recursos bibliográficos y de información en coherencia con las dinámicas propias del programa y su mejoramiento.',
    'C42: Evolución, suficiencia y evaluación de los recursos de infraestructura física y tecnológica en coherencia con el proyecto educativo del programa académico.',
    'C43: Identificación de los logros y resultados de la organización y la gestión del programa.',
    'C44: Evolución y evaluación de la sostenibilidad, los recursos y las capacidades del programa en coherencia con el proyecto educativo.',
    'C45: Liderazgo en la dirección y gestión.',
    'C46: Sistemas de comunicación e información actualizados, accesibles y oportunos en el mejoramiento del programa.',
    'C47: Consolidación de los recursos y capacidades coherentes con la evolución del programa.',
    'C48: Identificación de la sostenibilidad financiera del programa académico.',
    'C49: Reflexión y participación de la comunidad en los procesos de gestión, autoevaluación, autorregulación y mejoramiento permanente del programa académico.',
    'C50: Consolidación de la información y los datos que dan cuenta de los resultados, logros e impactos de la alta calidad del programa en el periodo de observación correspondiente a la autoevaluación.',
    'C51: Identificación de los principales resultados, logros e impactos de la cultura de la calidad en el mejoramiento del programa.'
  ];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;

    this.factoresList = this.FACTORES.map(f => ({ id: f, nombre: f }));
    this.caracteristicasList = this.CARACTERISTICAS.map(c => ({ id: c, nombre: c }));

    this.route.queryParams.subscribe(params => {
      this.selectedProgramName = params['programName'] || 'Ingeniería';
      this.selectedCharName = params['charName'] || 'Condición General';
      this.selectedCharNum = params['charNum'] || '';
      this.selectedCharStatus = params['charStatus'] || 'pendiente';
      this.selectedCharFactor = params['factor'] || '';
    });

    this.initForm();
    this.calculateAllPercentages();
  }

  initForm(): void {
    this.docenteForm = this.fb.group({
      generalData: this.fb.group({
        sniesInstitucion: [{ value: '2830', disabled: true }],
        nombreInstitucion: [{ value: 'Corporación Universitaria Iberoamericana', disabled: true }],
        nombrePrograma: [{ value: this.selectedProgramName, disabled: true }],
        normaInternaCreacion: ['Resolución 458 de 1 septiembre de 2017', Validators.required],
        tituloOtorgar: ['Ingeniero de Software', Validators.required],
        facultad: ['Ingeniería', Validators.required],
        campoAmplio: ['Ingeniería, industria y construcción', Validators.required],
        campoEspecifico: ['Ingeniería y profesiones afines', Validators.required],
        campoDetallado: ['Ingeniería de Software y afines', Validators.required],
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
        definicionACOFI: ['Enfoque integral en el diseño, desarrollo, pruebas e implementación de software de calidad.', Validators.required],
        definicionIISE: ['Organización, mejora y optimización de sistemas y procesos tecnológicos.', Validators.required],
        factor: [this.selectedCharFactor || '', Validators.required],
        caracteristica: ['', Validators.required],
        competencias: this.fb.array([this.createCompetencyGroup()])
      }),
      organizacion: this.fb.group({
        perfilProfesional: ['Profesional ético con capacidad para resolver problemas tecnológicos.', Validators.required],
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
      resultadosAprendizaje: ['Al finalizar el programa, el estudiante diseña arquitecturas de software robustas.', Validators.required],
      competenciasGenerales: ['Capacidad de trabajo en equipo, pensamiento crítico e innovación.', Validators.required]
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
      status: ['Pendiente']
    });
  }

  get nucleos(): FormArray {
    return this.docenteForm.get('organizacion.nucleosCurriculares') as FormArray;
  }

  get competencias(): FormArray {
    return this.docenteForm.get('coherencia.competencias') as FormArray;
  }

  get anexos(): FormArray {
    return this.docenteForm.get('anexos') as FormArray;
  }

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

  saveV2Form(): void {
    if (this.docenteForm.valid) {
      console.log('Formulario V2 guardado:', this.docenteForm.getRawValue());
      this.notificationService.show('Información guardada y enviada al SIAC exitosamente.', 'success');
      this.goBack();
    } else {
      this.notificationService.show('Por favor completa todos los campos requeridos.', 'error');
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/docente/programas']);
  }
}
