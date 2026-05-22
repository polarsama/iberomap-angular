export interface GeneralData {
  sniesInstitucion: string;
  nombreInstitucion: string;
  nombrePrograma: string;
  normaInternaCreacion: string;
  tituloOtorgar: string;
  facultad: string;
  campoAmplio: string;
  campoEspecifico: string;
  campoDetallado: string;
  nivelAcademico: string;
  cupoEstudiantes: string;
  requisitosIdioma: string;
  modalidad: string;
  porcentajeTecnologia: string;
  numeroCreditos: number;
  periodicidadAdmision: string;
  duracionPrograma: string;
  ubicacion: string;
  direccionDomicilio: string;
  valorMatricula: string;
  email: string;
}

export interface CurricularCore {
  nombre: string;
  modulos: number;
  creditos: number;
  porcentaje: number;
}

export interface CompetencyRow {
  campoConocimiento: string;
  resultadosAprendizaje: string[];
  competenciasGenerales: string[];
}

export interface Annex {
  id: number;
  nombre: string;
  archivo: File | null;
  cargado: boolean;
}

export interface DiligenciarCondicionData {
  generalData: GeneralData;
  definicionACOFI: string;
  definicionIISE: string;
  factor: string;
  caracteristica: string;
  competencias: CompetencyRow[];
  perfilProfesional: string;
  nucleosCurriculares: CurricularCore[];
  anexos: Annex[];
}
