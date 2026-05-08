import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [ngStyle]="customStyle">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card {
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12), 0 1px 5px 0 rgba(0,0,0,.2);
      padding: 20px;
    }
  `]
})
export class CardComponent {
  @Input() customStyle: any = {};
}
