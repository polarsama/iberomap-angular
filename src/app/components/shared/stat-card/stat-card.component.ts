import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card">
      <div class="value" [style.color]="color || 'var(--ibero-black)'">{{ value }}</div>
      <div class="label">{{ label }}</div>
      <div class="sub" *ngIf="sub">{{ sub }}</div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12), 0 1px 5px 0 rgba(0,0,0,.2);
      padding: 16px 20px;
      min-width: 130px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }
    .value {
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
    }
    .label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: var(--ibero-gray-mid);
    }
    .sub {
      font-size: 11px;
      color: var(--ibero-gray);
      margin-top: 2px;
    }
  `]
})
export class StatCardComponent {
  @Input() value: string | number = '';
  @Input() label: string = '';
  @Input() sub?: string;
  @Input() color?: string;
}
