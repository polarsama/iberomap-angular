import { Routes } from '@angular/router';
import { LandingComponent } from './views/landing/landing.component';
import { LoginComponent } from './views/login/login.component';
import { LiderDashboardComponent } from './views/dashboards/lider/lider-dashboard.component';
import { DecanoDashboardComponent } from './views/dashboards/decano/decano-dashboard.component';
import { DirectorDashboardComponent } from './views/dashboards/director/director-dashboard.component';
import { DocenteDashboardComponent } from './views/dashboards/docente/docente-dashboard.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard/lider', component: LiderDashboardComponent },
  { path: 'dashboard/decano', component: DecanoDashboardComponent },
  { path: 'dashboard/director', component: DirectorDashboardComponent },
  { path: 'dashboard/docente', component: DocenteDashboardComponent },
  { path: '**', redirectTo: '' }
];
