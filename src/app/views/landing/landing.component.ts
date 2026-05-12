import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  features = [
    { icon: 'assignment', title: 'Formularios MAP estructurados', desc: 'Diligencia los 12 factores y 41 características del proceso de autoevaluación desde una interfaz clara por rol.' },
    { icon: 'content_copy', title: 'Reutilización de contenido', desc: 'El sistema detecta el 80% de contenido compartido entre programas de la misma facultad y lo sugiere automáticamente.' },
    { icon: 'file_download', title: 'Generación automática', desc: 'Genera el Cuadro Maestro en Excel formato oficial IP-FT-27 V04 exigido por el Ministerio de Educación Nacional.' },
  ];

  roles = [
    { icon: 'admin_panel_settings', key: 'lider',    title: 'Líder de Aseguramiento', desc: 'Administra toda la plataforma y supervisa el avance global de todos los programas.' },
    { icon: 'school',               key: 'decano',   title: 'Decano',                 desc: 'Monitorea los indicadores de su facultad y revisa el avance de cada programa.' },
    { icon: 'settings',               key: 'admin',    title: 'Administrador',          desc: 'Gestiona usuarios, roles y la configuración técnica global de la plataforma.' },
    { icon: 'person',                 key: 'docente',  title: 'Docente',                desc: 'Carga las evidencias y descriptores correspondientes a sus características.' },
  ];

  roleColors: any = {
    lider: '#1a237e', decano: '#006064', admin: '#D0AB4B', docente: '#37474f',
  };

  stats = [
    { v: '11', l: 'Programas' },
    { v: '12', l: 'Factores' },
    { v: '41', l: 'Características' },
    { v: '60%', l: 'Menos tiempo' }
  ];

  constructor(private router: Router) {}

  onLogin() {
    this.router.navigate(['/login']);
  }
}
