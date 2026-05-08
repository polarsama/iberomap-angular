import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  @Input() userName: string = '';
  @Input() userRole: string = '';
  @Input() navItems: NavItem[] = [];
  @Input() activeItem: string = '';

  @Output() logout = new EventEmitter<void>();
  @Output() navClick = new EventEmitter<string>();

  getInitials(): string {
    if (!this.userName) return 'IB';
    return this.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  onLogout() {
    this.logout.emit();
  }

  onNavClick(id: string) {
    this.navClick.emit(id);
  }
}
