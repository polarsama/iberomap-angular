import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnComponent } from '../btn/btn.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, BtnComponent],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
  @Input() title: string = '¿Confirmar eliminación?';
  @Input() confirmText: string = 'Confirmar Eliminación';
  @Input() cancelText: string = 'Cancelar';
  @Input() icon: string = 'warning_amber';
  @Input() confirmColor: string = '#E53935';
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}
