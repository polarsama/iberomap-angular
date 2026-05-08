import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [disabled]="disabled" (click)="onClick.emit()" class="app-btn" [ngStyle]="getStyle()">
      <i *ngIf="icon" class="material-icons" [style.fontSize.px]="sm ? 14 : 18" [style.animation]="loading ? 'spin 1s linear infinite' : 'none'">{{ icon }}</i>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .app-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      border-radius: 4px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      letter-spacing: .03em;
      cursor: pointer;
      transition: filter .15s, box-shadow .2s;
      white-space: nowrap;
      border: none;
    }
    .app-btn:disabled {
      cursor: default;
      filter: grayscale(50%) opacity(0.8);
    }
  `]
})
export class BtnComponent {
  @Input() icon?: string;
  @Input() variant: 'primary' | 'accent' | 'success' | 'danger' | 'flat' | 'outline' | 'light' | 'dark' | 'secondary' = 'primary';
  @Input() sm: boolean = false;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() customStyle: any = {};
  
  @Output() onClick = new EventEmitter<void>();

  private variants: any = {
    primary: { bg: 'var(--ibero-gold)', color: 'var(--ibero-black)' },
    accent:  { bg: 'var(--ibero-black)', color: 'var(--ibero-white)' },
    success: { bg: '#43a047', color: '#fff' },
    danger:  { bg: '#e53935', color: '#fff' },
    flat:    { bg: 'transparent', color: 'var(--ibero-black)', boxShadow: 'none' },
    outline: { bg: 'transparent', color: 'var(--ibero-black)', border: '1px solid var(--ibero-border)', boxShadow: 'none' },
    light:   { bg: 'var(--ibero-bg)', color: 'var(--ibero-black)', boxShadow: 'none' },
    dark:    { bg: 'var(--ibero-black)', color: 'var(--ibero-white)' },
    secondary: { bg: 'var(--ibero-gray)', color: 'var(--ibero-white)' },
  };

  getStyle() {
    const v = this.variants[this.variant] || this.variants.primary;
    return {
      padding: this.sm ? '0 10px' : '0 16px',
      height: this.sm ? '28px' : '36px',
      background: v.bg,
      color: v.color,
      fontSize: this.sm ? '11px' : '13px',
      boxShadow: v.boxShadow !== undefined ? v.boxShadow : '0 2px 2px 0 rgba(0,0,0,.14)',
      border: v.border || 'none',
      ...this.customStyle
    };
  }
}
