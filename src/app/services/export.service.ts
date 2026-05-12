import { Injectable } from '@angular/core';
import { LiderDataService } from './lider-data.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private dataService: LiderDataService, private authService: AuthService) {}

  exportToExcel(type: string) {
    let headers: string[] = [];
    let csvData = '';
    let filename = 'reporte';

    if (type === 'usuarios') {
      headers = ['Usuario', 'Correo', 'Rol MAP', 'Estado'];
      csvData = this.dataService.users.map(u => `"${u.name}","${u.email}","${u.role}","${u.status}"`).join('\n');
      filename = 'reporte_usuarios_ibero';
    } else if (type === 'reportes') {
      headers = ['Facultad', 'Programas', 'Avance General'];
      csvData = this.dataService.faculties.map(f => `"${f.name}","${f.programs}","${f.pct}%"`).join('\n');
      filename = 'reporte_gestion_facultades';
    } else {
      headers = ['Programa', 'Facultad', 'Tipo', 'Estado', 'Avance', 'SNIES'];
      csvData = this.dataService.programs.map(p => 
        `"${p.name}","${p.faculty}","${p.type}","${p.status}","${this.getProgramProgress(p)}%","${p.snies}"`
      ).join('\n');
      filename = 'reporte_programas_ibero';
    }
    
    const blob = new Blob([headers.join(',') + '\n' + csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToPDF(type: string) {
    const user = this.authService.currentUserValue;
    let title = 'REPORTE DE PROGRAMAS ACADÉMICOS';
    let contentHtml = '';
    let extraStyles = '';

    if (type === 'usuarios') {
      title = 'REPORTE DE GESTIÓN DE USUARIOS';
      contentHtml = `
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol MAP</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${this.dataService.users.map(u => `
              <tr>
                <td style="font-weight:700">${u.name}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td>${u.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (type === 'reportes') {
      title = 'REPORTE DE AVANCE POR FACULTAD';
      contentHtml = `
        <table>
          <thead>
            <tr>
              <th>Facultad</th>
              <th>Total Programas</th>
              <th>Avance General</th>
            </tr>
          </thead>
          <tbody>
            ${this.dataService.faculties.map(f => `
              <tr>
                <td style="font-weight:700">${f.name}</td>
                <td>${f.programs}</td>
                <td>
                  <div class="progress-wrapper">
                    <div class="progress-bar"><div class="progress-fill" style="width:${f.pct}%"></div></div>
                    <span class="progress-text">${f.pct}%</span>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      // Dashboard/Programas
      const tableInner = document.querySelector('.table-responsive table')?.innerHTML;
      if (!tableInner) {
          // Fallback if table is not in DOM
          contentHtml = `
            <table>
              <thead>
                <tr>
                  <th>Programa</th>
                  <th>Facultad</th>
                  <th>Estado</th>
                  <th>Avance</th>
                </tr>
              </thead>
              <tbody>
                ${this.dataService.programs.map(p => `
                  <tr>
                    <td style="font-weight:700">${p.name}</td>
                    <td>${p.faculty}</td>
                    <td>${p.status}</td>
                    <td>${this.getProgramProgress(p)}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
      } else {
          contentHtml = `<table>${tableInner}</table>`;
          extraStyles = `
            th:nth-child(6), td:nth-child(6),
            th:nth-child(7), td:nth-child(7) { display: none; }
            th:nth-child(1) { width: 35%; }
            th:nth-child(2) { width: 20%; }
          `;
      }
    }

    const windowPrint = window.open('', '', 'width=900,height=900');
    if (!windowPrint) return;

    windowPrint.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page { size: landscape; margin: 20mm; }
            body { font-family: 'Montserrat', sans-serif; padding: 0; color: #222; }
            .header-report { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 3px solid #D0AB4B; padding-bottom: 15px; }
            .header-report h1 { margin: 0; color: #222; font-size: 24px; font-weight: 800; }
            .header-report p { margin: 0; color: #666; font-size: 11px; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; }
            th { background: #222; color: #fff; padding: 12px 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
            td { padding: 12px 10px; border-bottom: 1px solid #EEE; font-size: 11px; word-wrap: break-word; }
            ${extraStyles}
            .progress-wrapper { display: flex; align-items: center; gap: 8px; }
            .progress-bar { flex: 1; height: 8px; background: #EEE; border-radius: 4px; overflow: hidden; }
            .progress-fill { height: 100%; background: #D0AB4B; }
            .progress-text { font-weight: 700; font-size: 10px; }
            .header-filters, .action-buttons, .status-dot { display: none !important; }
          </style>
        </head>
        <body>
          <div class="header-report">
            <h1>${title}</h1>
            <p>Generado por: ${user?.name} · ${new Date().toLocaleString()}</p>
          </div>
          ${contentHtml}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 700);
          </script>
        </body>
      </html>
    `);
    windowPrint.document.close();
  }

  private getProgramProgress(p: any): number {
    if (!p.conditionsTotal) return 0;
    return Math.round((p.conditionsCompleted / p.conditionsTotal) * 100);
  }
}
