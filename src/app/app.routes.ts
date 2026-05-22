import { Routes } from '@angular/router';
import { LandingComponent } from './views/landing/landing.component';
import { LoginComponent } from './views/login/login.component';
import { LiderDashboardComponent } from './views/dashboards/lider/lider-dashboard.component';
import { DecanoDashboardComponent } from './views/dashboards/decano/decano-dashboard.component';
import { DocenteDashboardComponent } from './views/dashboards/docente/docente-dashboard.component';
import { AdminDashboardComponent } from './views/dashboards/admin/admin-dashboard.component';
import { LiderOverviewComponent } from './views/dashboards/lider/tabs/overview/lider-overview.component';
import { LiderProgramasComponent } from './views/dashboards/lider/tabs/programas/lider-programas.component';
import { LiderProgramConditionsComponent } from './views/dashboards/lider/tabs/programas/condiciones/lider-program-conditions.component';
import { LiderReportesComponent } from './views/dashboards/lider/tabs/reportes/lider-reportes.component';
import { LiderUsuariosComponent } from './views/dashboards/lider/tabs/usuarios/lider-usuarios.component';
import { DocenteProgramasComponent } from './views/dashboards/docente/tabs/programas/docente-programas.component';
import { DiligenciarCondicionComponent } from './views/dashboards/docente/tabs/diligenciar-condicion/diligenciar-condicion.component';
import { DocenteRegistroCalificadoComponent } from './views/dashboards/docente/tabs/registro-calificado/docente-registro-calificado.component';
import { ConditionManagerComponent } from './features/registro-calificado/pages/condition-manager/condition-manager.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard/lider', 
    component: LiderDashboardComponent,
    children: [
      { path: '', redirectTo: 'resumen', pathMatch: 'full' },
      { path: 'resumen', component: LiderOverviewComponent },
      { path: 'programas', component: LiderProgramasComponent },
      { path: 'programas/:id/condiciones', component: LiderProgramConditionsComponent },
      { path: 'reportes', component: LiderReportesComponent },
      { path: 'usuarios', component: LiderUsuariosComponent }
    ]
  },
  { 
    path: 'dashboard/decano', 
    component: DecanoDashboardComponent,
    children: [
      { path: '', redirectTo: 'resumen', pathMatch: 'full' },
      { path: 'resumen', loadComponent: () => import('./views/dashboards/decano/tabs/resumen/decano-overview.component').then(m => m.DecanoOverviewComponent) },
      { path: 'programas', loadComponent: () => import('./views/dashboards/decano/tabs/programas/decano-programas.component').then(m => m.DecanoProgramasComponent) },
      { path: 'reportes', loadComponent: () => import('./views/dashboards/decano/tabs/reportes/decano-reportes.component').then(m => m.DecanoReportesComponent) }
    ]
  },
  { 
    path: 'dashboard/docente', 
    component: DocenteDashboardComponent,
    children: [
      { path: '', redirectTo: 'programas', pathMatch: 'full' },
      { path: 'programas', component: DocenteProgramasComponent },
      { path: 'registro-calificado', component: DocenteRegistroCalificadoComponent },
      { path: 'diligenciar-condicion', component: DiligenciarCondicionComponent }
    ]
  },
  { path: 'dashboard/docente-v2', redirectTo: 'dashboard/docente/programas', pathMatch: 'full' },
  { path: 'dashboard/registro-calificado', redirectTo: 'dashboard/docente/registro-calificado', pathMatch: 'full' },
  { path: 'dashboard/admin', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];

