
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { DynamicField, CatalogOption } from '../../../../core/models/registro-calificado.model';
import { DynamicFormService } from '../../../../core/services/dynamic-form.service';

@Component({
  selector: 'app-dynamic-form-engine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-engine.component.html',
  styleUrls: ['./form-engine.component.css']
})
export class DynamicFormEngineComponent implements OnInit, OnChanges {
  @Input() fields: DynamicField[] = [];
  @Input() catalogs: { [key: string]: CatalogOption[] } = {};
  @Output() formSubmit = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private dynamicFormService: DynamicFormService) {}

  ngOnInit(): void {
    if (this.fields.length > 0) {
      this.form = this.dynamicFormService.toFormGroup(this.fields);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields'] && !changes['fields'].firstChange) {
      this.form = this.dynamicFormService.toFormGroup(this.fields);
    }
  }

  getFormArray(key: string): FormArray {
    return this.form.get(key) as FormArray;
  }

  addRow(key: string, columns: string[]): void {
    this.dynamicFormService.addTableRow(this.getFormArray(key), columns);
  }

  removeRow(key: string, index: number): void {
    this.dynamicFormService.removeTableRow(this.getFormArray(key), index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.getRawValue());
    }
  }

  onFileChange(event: any, key: string): void {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ [key]: file });
    }
  }
}
