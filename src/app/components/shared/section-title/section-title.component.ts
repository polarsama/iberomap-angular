import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-title-container">
      <i *ngIf="icon" class="material-icons title-icon">{{ icon }}</i>
      <h2 class="title-text"><ng-content></ng-content></h2>
    </div>
  `,
  styles: [`
    .section-title-container {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .title-icon {
      font-size: 20px;
      color: var(--ibero-gold);
    }
    .title-text {
      font-size: 16px;
      font-weight: 700;
      color: var(--ibero-black);
      letter-spacing: .01em;
    }
  `]
})
export class SectionTitleComponent {
  @Input() icon?: string;
}
