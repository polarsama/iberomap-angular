import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiderDataService {
  private _programs = new BehaviorSubject<any[]>([
    { id: 1, name: 'Ingeniería de Sistemas', faculty: 'Ingeniería', type: 'Renovación',     status: 'en progreso', snies: '12345', docentes: 2, conditionsTotal: 51, conditionsCompleted: 40, collaborators: [{id: 1, name: 'Carlos Ruiz', initials: 'CR', email: 'carlos.ruiz@ibero.edu.co'}, {id: 2, name: 'Ana Patiño', initials: 'AP', email: 'ana.patino@ibero.edu.co'}] },
    { id: 2, name: 'Psicología',             faculty: 'Ciencias Humanas', type: 'Acreditación', status: 'completado',  snies: '23456', docentes: 2, conditionsTotal: 51, conditionsCompleted: 51, collaborators: [{id: 3, name: 'Laura Gómez', initials: 'LG', email: 'laura.gomez@ibero.edu.co'}, {id: 4, name: 'Pablo Mora', initials: 'PM', email: 'pablo.mora@ibero.edu.co'}] },
    { id: 3, name: 'Administración de Emp.', faculty: 'Ciencias Empresariales', type: 'Renovación', status: 'en progreso', snies: '34567', docentes: 1, conditionsTotal: 51, conditionsCompleted: 28, collaborators: [{id: 1, name: 'Carlos Ruiz', initials: 'CR', email: 'carlos.ruiz@ibero.edu.co'}] },
    { id: 4, name: 'Derecho',                faculty: 'Ciencias Jurídicas', type: 'Autoevaluación', status: 'no iniciado', snies: '45678', docentes: 0, conditionsTotal: 51, conditionsCompleted: 0, collaborators: [] },
    { id: 5, name: 'Contaduría Pública',     faculty: 'Ciencias Empresariales', type: 'Renovación', status: 'en progreso', snies: '56789', docentes: 1, conditionsTotal: 51, conditionsCompleted: 21, collaborators: [{id: 2, name: 'Ana Patiño', initials: 'AP', email: 'ana.patino@ibero.edu.co'}] },
    { id: 6, name: 'Medicina',               faculty: 'Ciencias de la Salud', type: 'Acreditación', status: 'completado', snies: '67890', docentes: 3, conditionsTotal: 51, conditionsCompleted: 45, collaborators: [{id: 1, name: 'Carlos Ruiz', initials: 'CR', email: 'carlos.ruiz@ibero.edu.co'}, {id: 2, name: 'Ana Patiño', initials: 'AP', email: 'ana.patino@ibero.edu.co'}, {id: 5, name: 'Felipe Quintero', initials: 'FQ', email: 'felipe.q@ibero.edu.co'}] },
    { id: 7, name: 'Enfermería',             faculty: 'Ciencias de la Salud', type: 'Renovación', status: 'no iniciado', snies: '78901', docentes: 0, conditionsTotal: 51, conditionsCompleted: 2, collaborators: [] },
  ]);

  private _users = new BehaviorSubject<any[]>([
    { id: 1, name: 'Carlos Ruiz', email: 'carlos.ruiz@ibero.edu.co', role: 'docente', status: 'activo' },
    { id: 2, name: 'Ana Patiño', email: 'ana.patino@ibero.edu.co', role: 'docente', status: 'activo' },
    { id: 3, name: 'Laura Gómez', email: 'laura.gomez@ibero.edu.co', role: 'admin', status: 'activo' },
    { id: 4, name: 'Pablo Mora', email: 'pablo.mora@ibero.edu.co', role: 'admin', status: 'activo' },
    { id: 5, name: 'Felipe Quintero', email: 'felipe.q@ibero.edu.co', role: 'decano', status: 'activo' },
  ]);

  faculties = [
    { name: 'Ingeniería', programs: 12, pct: 65 },
    { name: 'Ciencias Humanas', programs: 8, pct: 42 },
    { name: 'Ciencias Empresariales', programs: 15, pct: 58 },
    { name: 'Ciencias de la Salud', programs: 10, pct: 81 },
    { name: 'Ciencias Jurídicas', programs: 5, pct: 30 },
  ];

  programs$ = this._programs.asObservable();
  users$ = this._users.asObservable();

  get programs() { return this._programs.value; }
  get users() { return this._users.value; }

  saveProgram(program: any) {
    const current = this._programs.value;
    if (program.id) {
      const idx = current.findIndex(p => p.id === program.id);
      if (idx !== -1) current[idx] = { ...program };
    } else {
      current.unshift({ ...program, id: Date.now(), status: 'no iniciado', docentes: 0, collaborators: [] });
    }
    this._programs.next([...current]);
  }

  deleteProgram(id: number) {
    this._programs.next(this._programs.value.filter(p => p.id !== id));
  }

  saveUser(user: any) {
    const current = this._users.value;
    if (user.id) {
      const idx = current.findIndex(u => u.id === user.id);
      if (idx !== -1) current[idx] = { ...user };
    } else {
      current.unshift({ ...user, id: Date.now() });
    }
    this._users.next([...current]);
  }

  toggleUserStatus(user: any) {
    const current = this._users.value;
    const idx = current.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      current[idx].status = current[idx].status === 'activo' ? 'inactivo' : 'activo';
      this._users.next([...current]);
    }
  }
}
