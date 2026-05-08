import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-chip" [style.background]="getBgColor()" [style.color]="getTextColor()">
      {{ getLabel() }}
    </span>
  `,
  styles: [`
    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }
  `]
})
export class StatusChipComponent {
  @Input() status: string = '';

  private get map(): any {
    return {
      completado:  { bg: '#43a047', color: '#fff', label: 'Completado' },
      'en progreso': { bg: '#fb8c00', color: '#fff', label: 'En progreso' },
      pendiente:   { bg: '#e0e0e0', color: '#757575', label: 'Pendiente' },
      'no iniciado': { bg: '#b0bec5', color: '#fff', label: 'No iniciado' },
    };
  }

  private getConfig() {
    const s = this.status?.toLowerCase();
    return this.map[s] || this.map['pendiente'];
  }

  getBgColor() { return this.getConfig().bg; }
  getTextColor() { return this.getConfig().color; }
  getLabel() { return this.getConfig().label; }
}
