
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { DynamicField } from '../models/registro-calificado.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor(private fb: FormBuilder) {}

  toFormGroup(fields: DynamicField[]): FormGroup {
    const group: any = {};

    fields.forEach(field => {
      if (field.tipoControl === 'table') {
        // Para tablas dinámicas, inicializamos un FormArray
        group[field.key] = this.fb.array(
          (field.valor || []).map((row: any) => this.createTableRow(row, field.config?.columns))
        );
      } else {
        // Control estándar
        group[field.key] = [
          field.valor || '',
          field.requerido ? Validators.required : null
        ];
      }
    });

    return this.fb.group(group);
  }

  private createTableRow(data: any, columns: string[]): FormGroup {
    const rowGroup: any = {};
    columns.forEach(col => {
      rowGroup[col] = [data[col] || '', Validators.required];
    });
    return this.fb.group(rowGroup);
  }

  addTableRow(formArray: FormArray, columns: string[]): void {
    const rowGroup: any = {};
    columns.forEach(col => {
      rowGroup[col] = ['', Validators.required];
    });
    formArray.push(this.fb.group(rowGroup));
  }

  removeTableRow(formArray: FormArray, index: number): void {
    formArray.removeAt(index);
  }
}
