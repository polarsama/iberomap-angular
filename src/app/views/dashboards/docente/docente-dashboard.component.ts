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
  selector: 'app-docente-dashboard',
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
  templateUrl: './docente-dashboard.component.html',
  styleUrls: ['./docente-dashboard.component.css']
})
export class DocenteDashboardComponent implements OnInit {
  user: User | null = null;
  selectedChar: any = null;
  selectedProgram: any = null;
  activeTab = 'mis-chars';
  currentView: 'programs' | 'conditions' | 'form' = 'programs';

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
    'C7: Estímulos y apoyos para todos los estudiantes y en atención a la diversidad, el pluralismo y la inclusión.',
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

  navItems = [
    { id: 'mis-chars', label: 'Mis Programas', icon: 'folder' },
    { id: 'enviadas',  label: 'Enviadas',           icon: 'check_circle' },
  ];

  DOCENTE_PROGRAMS = [
    { id: 1, name: 'Ingeniería de Sistemas',     faculty: 'Ingeniería',           pct: 78, pending: 3 },
    { id: 2, name: 'Ingeniería Industrial',      faculty: 'Ingeniería',           pct: 45, pending: 2 },
  ];

  MY_CHARS = [
    { num: '1.2', factor: 'Factor 1 — Misión y PEP', name: 'Proyecto Educativo del Programa (PEP)', status: 'en progreso', dueDate: '2025-06-15', shared: 1 },
    { num: '3.1', factor: 'Factor 3 — Profesores', name: 'Selección, vinculación y permanencia de profesores', status: 'pendiente', dueDate: '2025-06-20' },
    { num: '3.3', factor: 'Factor 3 — Profesores', name: 'Número, dedicación y nivel de formación de profesores', status: 'pendiente', dueDate: '2025-06-20' },
    { num: '4.4', factor: 'Factor 4 — Procesos Académicos', name: 'Metodologías de enseñanza y aprendizaje', status: 'completado', dueDate: '2025-05-30', shared: 2 },
    { num: '6.1', factor: 'Factor 6 — Investigación', name: 'Grupos y líneas de investigación del programa', status: 'completado', dueDate: '2025-05-28' },
  ];

  grades = ['Se cumple plenamente', 'Se cumple en alto grado', 'Se cumple aceptablemente', 'Se cumple insatisfactoriamente', 'No se cumple'];
  selectedGrade = '';

  pending = 0;
  done = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    if (!this.user || this.user.role !== 'docente') {
      this.router.navigate(['/login']);
    }

    this.pending = this.MY_CHARS.filter(c => c.status !== 'completado').length;
    this.done = this.MY_CHARS.filter(c => c.status === 'completado').length;
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

  goToConditions(p: any) {
    this.selectedProgram = p;
    this.currentView = 'conditions';
  }

  goToForm(c: any = null) {
    this.selectedChar = c;
    this.currentView = 'form';
  }

  goBack() {
    if (this.currentView === 'form') {
      this.currentView = 'conditions';
      this.selectedChar = null;
    } else if (this.currentView === 'conditions') {
      this.currentView = 'programs';
      this.selectedProgram = null;
    }
  }

  deleteChar(char: any) {
    if (confirm('¿Estás seguro de que deseas eliminar esta condición?')) {
      this.MY_CHARS = this.MY_CHARS.filter(c => c !== char);
      this.done = this.MY_CHARS.filter(c => c.status === 'completado').length;
      this.pending = this.MY_CHARS.filter(c => c.status !== 'completado').length;
    }
  }

  saveForm(condicion: string, factor: string, carac: string) {
    if (!condicion || !factor || !carac) {
      alert('Por favor, complete los campos obligatorios (*).');
      return;
    }

    const factorNum = factor.split(':')[0];
    const caracParts = carac.split(': ');
    const caracNum = caracParts[0].replace('C', '') + '.1';
    const caracName = caracParts[1] || carac;

    this.MY_CHARS.unshift({
      num: caracNum,
      factor: factorNum + ' — ' + condicion.substring(0, 20) + '...',
      name: caracName,
      status: 'completado',
      dueDate: new Date().toISOString().split('T')[0],
      shared: 0
    });

    this.done++;
    this.pending = this.MY_CHARS.filter(c => c.status !== 'completado').length;

    this.goBack();
  }

  getAvancePct(): string {
    return Math.round((this.done / this.MY_CHARS.length) * 100) + '%';
  }
}
