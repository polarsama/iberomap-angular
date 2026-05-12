import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LiderDataService } from '../../../../../../services/lider-data.service';
import { CardComponent } from '../../../../../../components/shared/card/card.component';
import { SectionTitleComponent } from '../../../../../../components/shared/section-title/section-title.component';
import { StatusChipComponent } from '../../../../../../components/shared/status-chip/status-chip.component';

@Component({
  selector: 'app-lider-program-conditions',
  standalone: true,
  imports: [CommonModule, CardComponent, SectionTitleComponent, StatusChipComponent],
  templateUrl: './lider-program-conditions.component.html',
  styleUrls: ['../../../lider-dashboard.component.css']
})
export class LiderProgramConditionsComponent implements OnInit {
  programId: number = 0;
  program: any = null;
  conditions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: LiderDataService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.programId = +params['id'];
      this.loadProgram();
    });
  }

  loadProgram() {
    this.dataService.programs$.subscribe((programs: any[]) => {
      this.program = programs.find((p: any) => p.id === this.programId);
      if (this.program) {
        this.generateMockConditions();
      }
    });
  }

  generateMockConditions() {
    const caracNames = [
      'Proyecto educativo del programa.',
      'Relevancia académica y pertinencia social.',
      'Incidencia de las actividades de formación integral.',
      'Orientación, acompañamiento y seguimiento a estudiantes.',
      'Estrategias pedagógicas y trabajo colaborativo.',
      'Políticas académicas y normativas.',
      'Estímulos y apoyos para estudiantes.',
      'Procesos de selección y vinculación de profesores.'
    ];

    this.conditions = Array.from({ length: 51 }, (_, i) => ({
      id: i + 1,
      num: `C${i + 1}`,
      name: caracNames[i % caracNames.length],
      factor: `Factor ${Math.floor(i/4) + 1}`,
      status: i % 5 === 0 ? 'completado' : i % 3 === 0 ? 'en progreso' : 'no iniciado',
      description: i % 5 === 0 ? 'Descripción de la justificación técnica cargada por el docente...' : '',
    }));
  }

  goBack() {
    this.router.navigate(['/dashboard/lider/programas']);
  }
}
