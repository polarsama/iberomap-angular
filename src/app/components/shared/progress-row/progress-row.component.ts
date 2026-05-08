import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-row">
      <div class="label">{{ label }}</div>
      <div class="bar-container">
        <div class="bar-fill" 
             [style.width.%]="pct" 
             [style.background]="color || getBarColor()"></div>
      </div>
      <div class="percentage">{{ pct }}%</div>
    </div>
  `,
  styles: [`
    .progress-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    .label {
      font-size: 12px;
      font-weight: 500;
      color: #424242;
      width: 200px;
      flex-shrink: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bar-container {
      flex: 1;
      height: 8px;
      border-radius: 9999px;
      background: #e0e0e0;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 9999px;
      transition: width .4s ease;
    }
    .percentage {
      font-size: 11px;
      font-weight: 600;
      color: #757575;
      width: 36px;
      text-align: right;
    }
  `]
})
export class ProgressRowComponent {
  @Input() label: string = '';
  @Input() pct: number = 0;
  @Input() color?: string;

  getBarColor(): string {
    if (this.pct >= 80) return '#43a047';
    if (this.pct >= 40) return '#fb8c00';
    return '#e53935';
  }
}
