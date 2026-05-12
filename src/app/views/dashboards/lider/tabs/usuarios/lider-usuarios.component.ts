import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LiderDataService } from '../../../../../services/lider-data.service';
import { CardComponent } from '../../../../../components/shared/card/card.component';
import { SectionTitleComponent } from '../../../../../components/shared/section-title/section-title.component';
import { BtnComponent } from '../../../../../components/shared/btn/btn.component';
import { RoleChipComponent } from '../../../../../components/shared/role-chip/role-chip.component';

@Component({
  selector: 'app-lider-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, SectionTitleComponent, BtnComponent, RoleChipComponent],
  templateUrl: './lider-usuarios.component.html',
  styleUrls: ['../../lider-dashboard.component.css']
})
export class LiderUsuariosComponent implements OnInit {
  users: any[] = [];
  userFilters = { name: '', role: '', status: '' };
  rolesList = ['docente', 'admin', 'decano', 'lider'];
  userStatusList = ['activo', 'inactivo'];

  showUserModal = false;
  newUser: any = { id: null, name: '', email: '', role: 'docente', status: 'activo' };

  constructor(private dataService: LiderDataService) {}

  ngOnInit() {
    this.dataService.users$.subscribe(u => {
      this.users = u;
    });
  }

  get filteredUsers() {
    return this.users.filter(u => {
      const matchName = u.name.toLowerCase().includes(this.userFilters.name.toLowerCase()) || 
                       u.email.toLowerCase().includes(this.userFilters.name.toLowerCase());
      const matchRole = !this.userFilters.role || u.role === this.userFilters.role;
      const matchStatus = !this.userFilters.status || u.status === this.userFilters.status;
      return matchName && matchRole && matchStatus;
    });
  }

  openInviteUserModal() {
    this.newUser = { id: null, name: '', email: '', role: 'docente', status: 'activo' };
    this.showUserModal = true;
  }

  editUser(u: any) {
    this.newUser = { ...u };
    this.showUserModal = true;
  }

  saveUser() {
    this.dataService.saveUser(this.newUser);
    this.showUserModal = false;
  }

  toggleUserStatus(u: any) {
    this.dataService.toggleUserStatus(u);
  }
}
