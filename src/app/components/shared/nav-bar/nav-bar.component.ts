import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Input() userName: string = '';
  @Input() userRole: string = '';
  @Input() navItems: NavItem[] = [];
  @Input() activeItem: string = '';

  @Output() logout = new EventEmitter<void>();
  @Output() navClick = new EventEmitter<string>();

  isMenuOpen: boolean = false;
  showSettings: boolean = false;
  
  settingsData = {
    name: '',
    email: '',
    avatar: ''
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const user = this.authService.currentUserValue;
    if (user) {
      this.settingsData.name = user.name;
      this.settingsData.email = user.email;
    }
  }

  getInitials(): string {
    if (!this.userName) return 'IB';
    return this.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  onLogout() {
    this.logout.emit();
    this.isMenuOpen = false;
  }

  onNavClick(id: string) {
    this.navClick.emit(id);
    this.isMenuOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openSettings() {
    this.loadUserData();
    this.showSettings = true;
    this.isMenuOpen = false;
  }

  saveSettings() {
    this.authService.updateUser({
      name: this.settingsData.name,
      email: this.settingsData.email
    });
    this.showSettings = false;
    // In a real app, we might need to update the local @Input values if they don't sync automatically
    this.userName = this.settingsData.name;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.settingsData.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}

