
export interface Institution {
  id: string;
  nombre: string;
  snies: string;
  logo?: string;
}

export interface Faculty {
  id: string;
  nombre: string;
  decano: string;
  institutionId: string;
  soportesInstitucionales?: string[]; // IDs de documentos transversales
}

export interface Program {
  id: string;
  facultyId: string;
  nombre: string;
  snies: string;
  modalidad: 'Presencial' | 'Virtual' | 'Distancia';
  creditos: number;
}

export interface Condition {
  id: string;
  programId: string;
  numero: number;
  nombre: string;
  version: string;
  estado: 'Pendiente' | 'En Proceso' | 'Completado' | 'Observado';
}

export type ControlType = 'text' | 'number' | 'select' | 'file' | 'table' | 'textarea';

export interface DynamicField {
  id: string;
  conditionId: string;
  tipoControl: ControlType;
  key: string;
  label: string;
  valor: any;
  seccion: string;
  orden: number;
  requerido: boolean;
  config?: any; // Para tablas: columnas. Para select: catalogoID.
}

export interface CatalogOption {
  id: string;
  label: string;
  value: any;
}

export interface DynamicFormConfig {
  faculty: Faculty;
  program: Program;
  condition: Condition;
  fields: DynamicField[];
}
