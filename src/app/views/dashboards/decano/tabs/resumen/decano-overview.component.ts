import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../../../../components/shared/stat-card/stat-card.component';
import { CardComponent } from '../../../../../components/shared/card/card.component';
import { SectionTitleComponent } from '../../../../../components/shared/section-title/section-title.component';
import { ProgressRowComponent } from '../../../../../components/shared/progress-row/progress-row.component';

@Component({
  selector: 'app-decano-overview',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    CardComponent,
    SectionTitleComponent,
    ProgressRowComponent
  ],
  templateUrl: './decano-overview.component.html',
  styleUrls: ['./decano-overview.component.css']
})
export class DecanoOverviewComponent implements OnInit {
  programs = [
    { name: 'Ingeniería de Sistemas',    pct: 78 },
    { name: 'Ingeniería Industrial',     pct: 45 },
    { name: 'Ingeniería Electrónica',    pct: 8  },
  ];

  completedChars = 0;
  totalChars = 0;
  avgPct = 0;

  ngOnInit() {
    this.totalChars = 41 * this.programs.length;
    this.completedChars = this.programs.reduce((a, p) => a + Math.round(41 * p.pct / 100), 0);
    this.avgPct = Math.round(this.programs.reduce((a, p) => a + p.pct, 0) / this.programs.length);
  }

  getBarHeight(pct: number): string {
    return Math.max(8, (pct / 100) * 130) + 'px';
  }

  getShortName(name: string): string {
    return name.split(' ').slice(0, 2).join(' ');
  }
}
