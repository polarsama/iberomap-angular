import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../../../components/shared/card/card.component';
import { SectionTitleComponent } from '../../../../../components/shared/section-title/section-title.component';
import { NotificationService } from '../../../../../services/notification.service';

@Component({
  selector: 'app-decano-reportes',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    SectionTitleComponent
  ],
  templateUrl: './decano-reportes.component.html',
  styleUrls: ['./decano-reportes.component.css']
})
export class DecanoReportesComponent {
  private notificationService = inject(NotificationService);

  exportToPDF() {
    console.log('Exportando a PDF...');
    this.notificationService.show('Exportando reporte consolidado a PDF...', 'info');
  }

  exportToExcel() {
    console.log('Exportando a Excel...');
    this.notificationService.show('Exportando reporte consolidado a Excel...', 'info');
  }
}
