import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="role-chip" [style.background]="getBgColor()" [style.color]="getTextColor()">
      {{ getLabel() }}
    </span>
  `,
  styles: [`
    .role-chip {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
    }
  `]
})
export class RoleChipComponent {
  @Input() role: string = '';

  private get map(): any {
    return {
      lider:    { bg: 'var(--ibero-black)', color: 'var(--ibero-white)', label: 'Líder de Aseguramiento' },
      decano:   { bg: 'var(--ibero-gray)', color: 'var(--ibero-white)', label: 'Decano' },
      admin:    { bg: 'var(--ibero-gold)', color: 'var(--ibero-black)', label: 'Administrador' },
      docente:  { bg: 'var(--ibero-gray-mid)', color: 'var(--ibero-white)', label: 'Docente' },
    };
  }

  private getConfig() {
    return this.map[this.role] || { bg: 'var(--ibero-black)', color: 'var(--ibero-white)', label: this.role };
  }

  getBgColor() { return this.getConfig().bg; }
  getTextColor() { return this.getConfig().color; }
  getLabel() { return this.getConfig().label; }
}
