import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let msg of notificationService.getNotifications()()" 
           class="toast" 
           [class]="msg.type">
        <span class="message">{{ msg.text }}</span>
        <button class="close-btn" (click)="notificationService.dismiss(msg.id)">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .toast {
      pointer-events: auto;
      padding: 12px 20px;
      border-radius: 8px;
      background: #323232;
      color: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 250px;
      animation: slideIn 0.3s ease-out;
      font-size: 14px;
      font-weight: 500;
    }
    .toast.success { background: #43a047; }
    .toast.error { background: #d32f2f; }
    .toast.warning { background: #ffa000; }
    .toast.info { background: var(--ibero-black, #1a1a1a); border-left: 4px solid var(--ibero-gold, #c4a459); }

    .close-btn {
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.7);
      font-size: 20px;
      cursor: pointer;
      margin-left: auto;
      padding: 0 4px;
    }
    .close-btn:hover { color: white; }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  notificationService = inject(NotificationService);
}
