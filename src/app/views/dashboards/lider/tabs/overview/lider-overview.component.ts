import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiderDataService } from '../../../../../services/lider-data.service';
import { StatCardComponent } from '../../../../../components/shared/stat-card/stat-card.component';
import { CardComponent } from '../../../../../components/shared/card/card.component';
import { SectionTitleComponent } from '../../../../../components/shared/section-title/section-title.component';
import { StatusChipComponent } from '../../../../../components/shared/status-chip/status-chip.component';

@Component({
  selector: 'app-lider-overview',
  standalone: true,
  imports: [CommonModule, StatCardComponent, CardComponent, SectionTitleComponent, StatusChipComponent],
  templateUrl: './lider-overview.component.html',
  styleUrls: ['../../lider-dashboard.component.css']
})
export class LiderOverviewComponent implements OnInit {
  programs: any[] = [];
  faculties: any[] = [];
  stats = { completed: 0, inProgress: 0, notStarted: 0, avgPct: 0 };

  constructor(private dataService: LiderDataService) {}

  ngOnInit() {
    this.dataService.programs$.subscribe(p => {
      this.programs = p;
      this.calculateStats();
    });
    this.faculties = this.dataService.faculties;
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
}
