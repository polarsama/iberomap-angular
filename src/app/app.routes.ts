import { Routes } from '@angular/router';
import { LandingComponent } from './views/landing/landing.component';
import { LoginComponent } from './views/login/login.component';
import { LiderDashboardComponent } from './views/dashboards/lider/lider-dashboard.component';
import { DecanoDashboardComponent } from './views/dashboards/decano/decano-dashboard.component';
import { DocenteDashboardComponent } from './views/dashboards/docente/docente-dashboard.component';
import { AdminDashboardComponent } from './views/dashboards/admin/admin-dashboard.component';
import { LiderOverviewComponent } from './views/dashboards/lider/tabs/overview/lider-overview.component';
import { LiderProgramasComponent } from './views/dashboards/lider/tabs/programas/lider-programas.component';
import { LiderReportesComponent } from './views/dashboards/lider/tabs/reportes/lider-reportes.component';
import { LiderUsuariosComponent } from './views/dashboards/lider/tabs/usuarios/lider-usuarios.component';

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
      { path: 'reportes', component: LiderReportesComponent },
      { path: 'usuarios', component: LiderUsuariosComponent }
    ]
  },
  { path: 'dashboard/decano', component: DecanoDashboardComponent },
  { path: 'dashboard/docente', component: DocenteDashboardComponent },
  { path: 'dashboard/admin', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];
