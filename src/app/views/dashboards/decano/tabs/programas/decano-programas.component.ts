import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../../../components/shared/card/card.component';
import { SectionTitleComponent } from '../../../../../components/shared/section-title/section-title.component';
import { StatusChipComponent } from '../../../../../components/shared/status-chip/status-chip.component';

@Component({
  selector: 'app-decano-programas',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    SectionTitleComponent,
    StatusChipComponent
  ],
  templateUrl: './decano-programas.component.html',
  styleUrls: ['./decano-programas.component.css']
})
export class DecanoProgramasComponent {
  programs = [
    { name: 'Ingeniería de Sistemas',    type: 'Renovación',     status: 'en progreso', pct: 78 },
    { name: 'Ingeniería Industrial',     pct: 45, type: 'Autoevaluación', status: 'en progreso' },
    { name: 'Ingeniería Electrónica',    pct: 8,  type: 'Renovación',     status: 'no iniciado' },
  ];
}
