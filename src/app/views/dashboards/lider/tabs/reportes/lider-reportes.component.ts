import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiderDataService } from '../../../../../services/lider-data.service';
import { CardComponent } from '../../../../../components/shared/card/card.component';

@Component({
  selector: 'app-lider-reportes',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './lider-reportes.component.html',
  styleUrls: ['../../lider-dashboard.component.css']
})
export class LiderReportesComponent implements OnInit {
  faculties: any[] = [];

  constructor(private dataService: LiderDataService) {}

  ngOnInit() {
    this.faculties = this.dataService.faculties;
  }
}
