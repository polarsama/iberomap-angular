import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messages = signal<ToastMessage[]>([]);
  private counter = 0;

  getNotifications() {
    return this.messages.asReadonly();
  }

  show(text: string, type: ToastMessage['type'] = 'info') {
    const id = ++this.counter;
    this.messages.update(msgs => [...msgs, { id, text, type }]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => this.dismiss(id), 3000);
  }

  dismiss(id: number) {
    this.messages.update(msgs => msgs.filter(m => m.id !== id));
  }
}
