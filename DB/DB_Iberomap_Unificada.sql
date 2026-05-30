/* =============================================================================
   ARQUITECTURA DE BASE DE DATOS UNIFICADA Y ESCALABLE - IBEROMAP (SIAC) - FASE 2
   Diseñado por: Analista de Bases de Datos Senior
   Plataforma de Destino: MySQL / MariaDB (Optimizado para InnoDB)
   ============================================================================= */

-- 1. PREPARACIÓN E INICIALIZACIÓN
DROP DATABASE IF EXISTS IberomapDB;
CREATE DATABASE IberomapDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE IberomapDB;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- -----------------------------------------------------------------------------
-- TABLA 1: INSTITUCIONES (Con soporte para Rector y parámetros en formato JSON)
-- -----------------------------------------------------------------------------
CREATE TABLE instituciones (
    InstitutionID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(250) NOT NULL,
    SNIES VARCHAR(50) NOT NULL UNIQUE,
    LogoURL VARCHAR(500) DEFAULT NULL,
    Rector VARCHAR(150) DEFAULT NULL,
    Activo BOOLEAN DEFAULT TRUE,
    ParametrosExtra JSON DEFAULT NULL, -- Guarda información de decanatos activos, configuraciones de UI, etc.
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 2: PERIODOS_ACADEMICOS (Requerido para la configuración general por Administrador)
-- -----------------------------------------------------------------------------
CREATE TABLE periodos_academicos (
    PeriodoID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE, -- ej: '2026-1', '2026-2'
    FechaInicio DATE NOT NULL,
    FechaFin DATE NOT NULL,
    Estado ENUM('Activo', 'Inactivo') DEFAULT 'Inactivo',
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 3: FACULTADES
-- -----------------------------------------------------------------------------
CREATE TABLE facultades (
    FacultadID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Decano VARCHAR(150) DEFAULT NULL,
    InstitutionID INT NOT NULL,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_FACULTADES_INSTITUCION FOREIGN KEY (InstitutionID) REFERENCES instituciones(InstitutionID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 4: ROLES (Roles del sistema para control de acceso)
-- -----------------------------------------------------------------------------
CREATE TABLE roles (
    RolID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Descripcion VARCHAR(250) DEFAULT NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 5: PROGRAMAS (Con códigos externos para importaciones Banner/SIU)
-- -----------------------------------------------------------------------------
CREATE TABLE programas (
    ProgramaID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(250) NOT NULL,
    Nivel ENUM('Pregrado', 'Posgrado', 'Administrativo') DEFAULT 'Pregrado',
    FacultadID INT NOT NULL,
    Estado ENUM('Activo', 'En renovación', 'Inactivo') DEFAULT 'Activo',
    SNIES VARCHAR(50) NOT NULL UNIQUE,
    Modalidad ENUM('Presencial', 'Virtual', 'Distancia') DEFAULT 'Presencial',
    Creditos INT NOT NULL DEFAULT 0,
    FechaAprobacionAcreditacion DATE DEFAULT NULL,
    CodigoExternoBanner VARCHAR(100) DEFAULT NULL UNIQUE, -- ID de enlace con el sistema Banner
    CodigoExternoSIU VARCHAR(100) DEFAULT NULL UNIQUE,    -- ID de enlace con el sistema SIU
    FechaUltimaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_PROGRAMAS_FACULTAD FOREIGN KEY (FacultadID) REFERENCES facultades(FacultadID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 6: USUARIOS (Datos de usuario, credenciales y claves)
-- -----------------------------------------------------------------------------
CREATE TABLE usuarios (
    UsuarioID INT AUTO_INCREMENT PRIMARY KEY,
    Cedula VARCHAR(20) NOT NULL UNIQUE,
    Tipo_Documento VARCHAR(10) NOT NULL,
    Nombres VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    Correo VARCHAR(150) NOT NULL UNIQUE,
    Contrasena VARCHAR(255) NOT NULL, -- Clave/Password hash (optimizada para bcrypt/argon2)
    RolID INT NOT NULL,
    Estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    CodigoExternoBanner VARCHAR(100) DEFAULT NULL UNIQUE, -- ID del docente en Banner
    CodigoExternoSIU VARCHAR(100) DEFAULT NULL UNIQUE,    -- ID del docente en SIU
    TokenRecuperacionClave VARCHAR(255) DEFAULT NULL,    -- Token para restaurar contraseña
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_USUARIOS_ROLES FOREIGN KEY (RolID) REFERENCES roles(RolID)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 7: SESIONES_ACTIVAS (Permite al Administrador forzar el cierre de sesiones)
-- -----------------------------------------------------------------------------
CREATE TABLE sesiones_activas (
    SesionID INT AUTO_INCREMENT PRIMARY KEY,
    UsuarioID INT NOT NULL,
    Token VARCHAR(500) NOT NULL, -- Token JWT o de Sesión activa
    IP VARCHAR(45) DEFAULT NULL,
    Dispositivo VARCHAR(255) DEFAULT NULL,
    FechaLogin TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaExpiracion DATETIME NOT NULL,
    Activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT FK_SESIONES_USUARIO FOREIGN KEY (UsuarioID) REFERENCES usuarios(UsuarioID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 8: USUARIO_PROGRAMA_ASIGNACION (Intermedia para Colaboradores Múltiples)
-- -----------------------------------------------------------------------------
CREATE TABLE usuario_programa_asignacion (
    AsignacionID INT AUTO_INCREMENT PRIMARY KEY,
    UsuarioID INT NOT NULL,
    ProgramaID INT NOT NULL,
    FechaAsignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_ASIGNACION_USUARIO FOREIGN KEY (UsuarioID) REFERENCES usuarios(UsuarioID) ON DELETE CASCADE,
    CONSTRAINT FK_ASIGNACION_PROGRAMA FOREIGN KEY (ProgramaID) REFERENCES programas(ProgramaID) ON DELETE CASCADE,
    UNIQUE KEY UQ_USER_PROG (UsuarioID, ProgramaID)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 9: REGISTROS_CALIFICADOS (Control crítico de los 7 años y alertas de ley)
-- -----------------------------------------------------------------------------
CREATE TABLE registros_calificados (
    RegistroID INT AUTO_INCREMENT PRIMARY KEY,
    ProgramaID INT NOT NULL,
    PeriodoID INT DEFAULT NULL, -- Asociado a un periodo académico específico
    FechaOtorgamiento DATE NOT NULL,
    FechaVencimiento DATE NOT NULL,
    Estado ENUM('Vigente', 'Vencido', 'En Proceso') DEFAULT 'Vigente',
    FechaResolucion DATE DEFAULT NULL,
    NumeroResolucion VARCHAR(50) DEFAULT NULL,
    VigenciaAnios INT DEFAULT 7,
    -- Hito crítico: Cálculo automático de 1 año y 1 día antes del vencimiento para radicación oportuna (Alertas de Ley)
    FechaLimiteRadicacion DATE AS (DATE_SUB(FechaVencimiento, INTERVAL 366 DAY)) STORED,
    CONSTRAINT FK_REGISTROS_PROGRAMA FOREIGN KEY (ProgramaID) REFERENCES programas(ProgramaID) ON DELETE CASCADE,
    CONSTRAINT FK_REGISTROS_PERIODO FOREIGN KEY (PeriodoID) REFERENCES periodos_academicos(PeriodoID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 10: CONDICIONES_CALIDAD (Soporta las 51 condiciones del registro calificado/acreditación)
-- -----------------------------------------------------------------------------
CREATE TABLE condiciones_calidad (
    CondicionID INT AUTO_INCREMENT PRIMARY KEY,
    ProgramaID INT NOT NULL,
    Numero INT NOT NULL, -- 1 al 51 (o Decreto 1330)
    Nombre VARCHAR(250) NOT NULL,
    Version VARCHAR(10) DEFAULT '1.0',
    Estado ENUM('Pendiente', 'En Proceso', 'Completado', 'Observado') DEFAULT 'Pendiente',
    Tipo ENUM('Programa', 'Facultad', 'Institucional') NOT NULL,
    TextoTransversal LONGTEXT DEFAULT NULL, -- Compartido por la facultad
    CONSTRAINT FK_CONDICIONES_PROGRAMA FOREIGN KEY (ProgramaID) REFERENCES programas(ProgramaID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 11: FACTORES (Catálogo Maestro de Calidad)
-- -----------------------------------------------------------------------------
CREATE TABLE factores (
    FactorID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(250) NOT NULL,
    Descripcion TEXT DEFAULT NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 12: CARACTERISTICAS (Puntos específicos a evaluar dentro de cada factor)
-- -----------------------------------------------------------------------------
CREATE TABLE caracteristicas (
    CaracteristicaID INT AUTO_INCREMENT PRIMARY KEY,
    FactorID INT NOT NULL,
    Nombre VARCHAR(250) NOT NULL,
    Descripcion TEXT DEFAULT NULL,
    CONSTRAINT FK_CARACTERISTICAS_FACTOR FOREIGN KEY (FactorID) REFERENCES factores(FactorID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 13: RELACION_CONDICION_FACTOR (Cruce de condiciones y factores)
-- -----------------------------------------------------------------------------
CREATE TABLE relacion_condicion_factor (
    RelacionFactorID INT AUTO_INCREMENT PRIMARY KEY,
    CondicionID INT NOT NULL,
    FactorID INT NOT NULL,
    Observaciones TEXT DEFAULT NULL,
    CONSTRAINT FK_REL_CONDICION FOREIGN KEY (CondicionID) REFERENCES condiciones_calidad(CondicionID) ON DELETE CASCADE,
    CONSTRAINT FK_REL_FACTOR FOREIGN KEY (FactorID) REFERENCES factores(FactorID) ON DELETE CASCADE,
    UNIQUE KEY UQ_COND_FACT (CondicionID, FactorID)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 14: EVALUACION_CARACTERISTICA (Contenido de la autoevaluación/renovación)
-- -----------------------------------------------------------------------------
CREATE TABLE evaluacion_caracteristica (
    EvaluacionID INT AUTO_INCREMENT PRIMARY KEY,
    RelacionFactorID INT NOT NULL,
    CaracteristicaID INT NOT NULL,
    TextoEvaluacion LONGTEXT DEFAULT NULL,
    Estado ENUM('Pendiente', 'En Proceso', 'Completado') DEFAULT 'Pendiente',
    UltimaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_EVAL_RELACION FOREIGN KEY (RelacionFactorID) REFERENCES relacion_condicion_factor(RelacionFactorID) ON DELETE CASCADE,
    CONSTRAINT FK_EVAL_CARAC FOREIGN KEY (CaracteristicaID) REFERENCES caracteristicas(CaracteristicaID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 15: CAMPOS_DINAMICOS (Soporte al motor de formularios del Frontend)
-- -----------------------------------------------------------------------------
CREATE TABLE campos_dinamicos (
    CampoID INT AUTO_INCREMENT PRIMARY KEY,
    CondicionID INT NOT NULL,
    TipoControl ENUM('text', 'number', 'select', 'file', 'table', 'textarea') NOT NULL,
    ClaveCampo VARCHAR(100) NOT NULL, -- Key (e.g. 'justificacion_txt')
    Etiqueta VARCHAR(250) NOT NULL, -- Label visible
    Seccion VARCHAR(100) DEFAULT 'General',
    Orden INT NOT NULL DEFAULT 0,
    Requerido BOOLEAN DEFAULT FALSE,
    ConfigJSON LONGTEXT DEFAULT NULL, -- Configuración extra en JSON (columnas de tabla, catálogos, etc.)
    CONSTRAINT FK_CAMPOS_CONDICION FOREIGN KEY (CondicionID) REFERENCES condiciones_calidad(CondicionID) ON DELETE CASCADE,
    UNIQUE KEY UQ_COND_KEY (CondicionID, ClaveCampo)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 16: OPCIONES_CATALOGO (Opciones para selects y campos dinámicos)
-- -----------------------------------------------------------------------------
CREATE TABLE opciones_catalogo (
    OpcionID INT AUTO_INCREMENT PRIMARY KEY,
    CatalogoID VARCHAR(100) NOT NULL, -- Agrupador del catálogo (e.g., 'tipo_modalidad')
    Etiqueta VARCHAR(250) NOT NULL,
    Valor VARCHAR(250) NOT NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 17: ANEXOS (Repositorio Central de Archivos, Evidencias e Imágenes)
-- -----------------------------------------------------------------------------
CREATE TABLE anexos (
    AnexoID INT AUTO_INCREMENT PRIMARY KEY,
    NombreArchivo VARCHAR(255) NOT NULL,
    RutaArchivo VARCHAR(500) NOT NULL, -- Path en disco o CDN (AWS S3, Google Cloud Storage, etc.)
    TipoAnexo VARCHAR(100) NOT NULL, -- Tipo MIME (e.g., 'image/png', 'application/pdf')
    TamanioBytes INT NOT NULL DEFAULT 0, -- Tamaño del archivo para validaciones
    EsTransversal BOOLEAN DEFAULT FALSE, -- Si aplica a toda la institución (Soportes institucionales)
    HashArchivo VARCHAR(64) DEFAULT NULL, -- Hash SHA-256 para validaciones de integridad y duplicidad
    DatosBinarios LONGBLOB DEFAULT NULL, -- Soporte opcional para almacenamiento en BD de imágenes de firmas/logos
    CreadoPorUsuarioID INT DEFAULT NULL,
    FechaCarga DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_ANEXOS_USUARIO FOREIGN KEY (CreadoPorUsuarioID) REFERENCES usuarios(UsuarioID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 18: VALORES_CAMPOS_DINAMICOS (Guarda las respuestas dadas al formulario)
-- -----------------------------------------------------------------------------
CREATE TABLE valores_campos_dinamicos (
    ValorID INT AUTO_INCREMENT PRIMARY KEY,
    CampoID INT NOT NULL,
    EvaluacionID INT DEFAULT NULL, -- Opcional, si pertenece a la evaluación de una característica
    CondicionID INT NOT NULL, -- Condición a la que responde
    ValorText LONGTEXT DEFAULT NULL, -- Respuestas simples o de texto largo
    ValorJSON JSON DEFAULT NULL, -- Estructuras complejas (como tablas de competencias, etc.)
    AnexoID INT DEFAULT NULL, -- Si la respuesta es un archivo adjunto (evidencia real)
    UltimaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_VALOR_CAMPO FOREIGN KEY (CampoID) REFERENCES campos_dinamicos(CampoID) ON DELETE CASCADE,
    CONSTRAINT FK_VALOR_EVALUACION FOREIGN KEY (EvaluacionID) REFERENCES evaluacion_caracteristica(EvaluacionID) ON DELETE CASCADE,
    CONSTRAINT FK_VALOR_CONDICION FOREIGN KEY (CondicionID) REFERENCES condiciones_calidad(CondicionID) ON DELETE CASCADE,
    CONSTRAINT FK_VALOR_ANEXO FOREIGN KEY (AnexoID) REFERENCES anexos(AnexoID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 19: RELACION_ANEXOS_EVALUACION (Archivos de soporte tradicionales)
-- -----------------------------------------------------------------------------
CREATE TABLE relacion_anexos_evaluacion (
    RelacionID INT AUTO_INCREMENT PRIMARY KEY,
    EvaluacionID INT NOT NULL,
    AnexoID INT NOT NULL,
    CONSTRAINT FK_RELEVAL_EVAL FOREIGN KEY (EvaluacionID) REFERENCES evaluacion_caracteristica(EvaluacionID) ON DELETE CASCADE,
    CONSTRAINT FK_RELEVAL_ANEXO FOREIGN KEY (AnexoID) REFERENCES anexos(AnexoID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLAS ADICIONALES DE HISTORIAL Y SEGUIMIENTO (Acreditación, Autoevaluación, Indicadores)
-- -----------------------------------------------------------------------------
CREATE TABLE acreditaciones (
    AcreditacionID INT AUTO_INCREMENT PRIMARY KEY,
    FechaOtorgamiento DATE NOT NULL,
    VigenciaAnios INT NOT NULL,
    Estado VARCHAR(50) DEFAULT NULL,
    ProgramaID INT NOT NULL,
    CONSTRAINT FK_ACREDITACION_PROGRAMA FOREIGN KEY (ProgramaID) REFERENCES programas(ProgramaID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE autoevaluaciones (
    AutoevaluacionID INT AUTO_INCREMENT PRIMARY KEY,
    Fecha DATE NOT NULL,
    Tipo VARCHAR(50) DEFAULT NULL,
    Resultado VARCHAR(255) DEFAULT NULL,
    ProgramaID INT NOT NULL,
    CONSTRAINT FK_AUTOEVAL_PROGRAMA FOREIGN KEY (ProgramaID) REFERENCES programas(ProgramaID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE evaluaciones_externas (
    EvaluacionID INT AUTO_INCREMENT PRIMARY KEY,
    Fecha DATE NOT NULL,
    Resultado VARCHAR(255) DEFAULT NULL,
    TipoProceso VARCHAR(100) DEFAULT NULL,
    ProgramaID INT NOT NULL,
    CONSTRAINT FK_EVALEXT_PROGRAMA FOREIGN KEY (ProgramaID) REFERENCES programas(ProgramaID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE indicadores (
    IndicadorID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Valor VARCHAR(50) DEFAULT NULL,
    Fecha DATE DEFAULT NULL,
    ProgramaID INT NOT NULL,
    CONSTRAINT FK_INDICADORES_PROGRAMA FOREIGN KEY (ProgramaID) REFERENCES programas(ProgramaID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE planes_mejoramiento (
    PlanID INT AUTO_INCREMENT PRIMARY KEY,
    Descripcion VARCHAR(500) NOT NULL,
    Estado VARCHAR(50) DEFAULT NULL,
    FechaInicio DATE DEFAULT NULL,
    FechaFin DATE DEFAULT NULL,
    ProgramaID INT NOT NULL,
    CONSTRAINT FK_PLANES_PROGRAMA FOREIGN KEY (ProgramaID) REFERENCES programas(ProgramaID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- TABLA 20: AUDITORIA_SISTEMA (Bitácora de logs para auditoría de cambios)
-- -----------------------------------------------------------------------------
CREATE TABLE auditoria_sistema (
    AuditoriaID INT AUTO_INCREMENT PRIMARY KEY,
    UsuarioID INT DEFAULT NULL,
    Accion VARCHAR(50) NOT NULL, -- e.g. 'CREAR_USUARIO', 'MODIFICAR_CONDICION', 'CARGAR_ANEXO', 'CERRAR_SESION_FORZADA'
    TablaAfectada VARCHAR(100) NOT NULL,
    RegistroID INT DEFAULT NULL,
    Detalle LONGTEXT DEFAULT NULL,
    FechaHora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_AUDITORIA_USUARIO FOREIGN KEY (UsuarioID) REFERENCES usuarios(UsuarioID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- ÍNDICES Y OPTIMIZACIONES DE RENDIMIENTO
-- -----------------------------------------------------------------------------
CREATE INDEX IX_RC_VENCIMIENTO ON registros_calificados(FechaVencimiento);
CREATE INDEX IX_RC_LIMITE_RADICACION ON registros_calificados(FechaLimiteRadicacion);
CREATE INDEX IX_CONDICIONES_ESTADO ON condiciones_calidad(Estado);
CREATE INDEX IX_CAMPOS_CLAVE ON campos_dinamicos(ClaveCampo);
CREATE INDEX IX_ANEXOS_HASH ON anexos(HashArchivo);
CREATE INDEX IX_AUDITORIA_FECHA ON auditoria_sistema(FechaHora);
CREATE INDEX IX_SESIONES_TOKEN ON sesiones_activas(Token(255));

-- -----------------------------------------------------------------------------
-- INSERCIÓN DE DATOS SEMILLA (Seed Data)
-- -----------------------------------------------------------------------------

-- 1. Institución principal con Rector y configuraciones extras
INSERT INTO instituciones (Nombre, SNIES, LogoURL, Rector, ParametrosExtra) VALUES 
('Corporación Universitaria Iberoamericana', '1824', 'assets/images/logo_ibero.png', 'Dr. Ricardo Gómez', '{"decanatos_activos": true, "permitir_registro_libre": false}');

-- 2. Periodos Académicos
INSERT INTO periodos_academicos (Nombre, FechaInicio, FechaFin, Estado) VALUES
('2026-1', '2026-01-15', '2026-06-15', 'Activo'),
('2026-2', '2026-07-15', '2026-12-15', 'Inactivo');

-- 3. Facultades
INSERT INTO facultades (Nombre, Decano, InstitutionID) VALUES 
('Facultad de Ingeniería', 'Dr. Roberto Montoya', 1),
('Facultad de Ciencias Humanas', 'Dra. María Mercedes', 1),
('Facultad de Ciencias Empresariales', 'Dr. Germán Alonso', 1),
('Facultad de Ciencias de la Salud', 'Dra. Martha Liliana', 1),
('Facultad de Ciencias Jurídicas', 'Dr. Francisco Restrepo', 1);

-- 4. Roles
INSERT INTO roles (Nombre, Descripcion) VALUES 
('Líder de Aseguramiento', 'Responsable de controlar los registros calificados y acreditación a nivel institucional'),
('Decano', 'Visualiza reportes y supervisa las condiciones de los programas de su facultad'),
('Director de Programa', 'Administra el diligenciamiento de condiciones y asigna docentes a su programa'),
('Docente', 'Diligencia los contenidos y carga anexos en las condiciones y características'),
('Administrador del Sistema', 'Administración global de usuarios, roles, periodos y catálogos de base de datos');

-- 5. Programas (Con códigos externos mapeados a Banner/SIU)
INSERT INTO programas (Nombre, Nivel, FacultadID, Estado, SNIES, Modalidad, Creditos, CodigoExternoBanner, CodigoExternoSIU) VALUES
('Ingeniería de Sistemas', 'Pregrado', 1, 'En renovación', '12345', 'Virtual', 160, 'BANN_ING_01', 'SIU_ING_01'),
('Psicología', 'Pregrado', 2, 'Activo', '23456', 'Presencial', 155, 'BANN_PSI_02', 'SIU_PSI_02'),
('Administración de Empresas', 'Pregrado', 3, 'En renovación', '34567', 'Virtual', 144, 'BANN_ADM_03', 'SIU_ADM_03'),
('Derecho', 'Pregrado', 5, 'Activo', '45678', 'Presencial', 162, 'BANN_DER_04', 'SIU_DER_04'),
('Contaduría Pública', 'Pregrado', 3, 'En renovación', '56789', 'Virtual', 148, 'BANN_CON_05', 'SIU_CON_05'),
('Medicina', 'Pregrado', 4, 'Activo', '67890', 'Presencial', 250, 'BANN_MED_06', 'SIU_MED_06'),
('Enfermería', 'Pregrado', 4, 'Activo', '78901', 'Virtual', 160, 'BANN_ENF_07', 'SIU_ENF_07');

-- 6. Usuarios
INSERT INTO usuarios (Cedula, Tipo_Documento, Nombres, Apellidos, Correo, Contrasena, RolID, Estado, CodigoExternoBanner, CodigoExternoSIU) VALUES
('1001', 'CC', 'Carlos', 'Ruiz', 'carlos.ruiz@ibero.edu.co', '123', 4, 'Activo', 'DOC_RU_01', 'SIU_RU_01'),
('1002', 'CC', 'Ana', 'Patiño', 'ana.patino@ibero.edu.co', '123', 4, 'Activo', 'DOC_PA_02', 'SIU_PA_02'),
('1003', 'CC', 'Laura', 'Gómez', 'laura.gomez@ibero.edu.co', '123', 5, 'Activo', 'ADM_GO_03', 'SIU_GO_03'),
('1004', 'CC', 'Pablo', 'Mora', 'pablo.mora@ibero.edu.co', '123', 5, 'Activo', 'ADM_MO_04', 'SIU_MO_04'),
('1005', 'CC', 'Felipe', 'Quintero', 'felipe.q@ibero.edu.co', '123', 2, 'Activo', 'DEC_QU_05', 'SIU_QU_05'),
('1006', 'CC', 'Luis', 'Aseguramiento', 'lider.aseguramiento@u.edu.co', '123', 1, 'Activo', 'LID_AS_06', 'SIU_AS_06');

-- 7. Registro de sesiones de prueba
INSERT INTO sesiones_activas (UsuarioID, Token, IP, Dispositivo, FechaExpiracion, Activo) VALUES
(1, 'jwt_token_carlos_ruiz_example', '192.168.1.15', 'Chrome / Windows', '2026-06-30 12:00:00', 1),
(5, 'jwt_token_decano_felipe_example', '192.168.1.22', 'Safari / macOS', '2026-06-30 12:00:00', 1);

-- 8. Asignaciones de Usuarios a Programas (Colaboradores)
INSERT INTO usuario_programa_asignacion (UsuarioID, ProgramaID) VALUES
(1, 1), -- Carlos Ruiz asignado a Ingeniería de Sistemas
(2, 1), -- Ana Patiño asignada a Ingeniería de Sistemas
(1, 3), -- Carlos Ruiz asignado a Administración de Empresas
(2, 5), -- Ana Patiño asignada a Contaduría Pública
(1, 6), -- Carlos Ruiz asignado a Medicina
(2, 6); -- Ana Patiño asignada a Medicina

-- 9. Condiciones de Calidad (Decreto 1330) para Ingeniería de Sistemas (ProgramaID = 1)
INSERT INTO condiciones_calidad (ProgramaID, Numero, Nombre, Version, Estado, Tipo) VALUES
(1, 1, 'Denominación del Programa', '1.0', 'Completado', 'Programa'),
(1, 2, 'Justificación', '1.0', 'En Proceso', 'Programa'),
(1, 3, 'Aspectos Curriculares', '1.0', 'Pendiente', 'Programa'),
(1, 4, 'Organización de Actividades Académicas y Proceso Formativo', '1.0', 'Pendiente', 'Programa'),
(1, 5, 'Investigación, Innovación y/o Creación Artística', '1.0', 'Pendiente', 'Programa'),
(1, 6, 'Relación con el Sector Externo', '1.0', 'Pendiente', 'Programa'),
(1, 7, 'Profesores (Personal Docente)', '1.0', 'Pendiente', 'Programa'),
(1, 8, 'Medios Educativos', '1.0', 'Pendiente', 'Programa'),
(1, 9, 'Infraestructura Física y Tecnológica', '1.0', 'Pendiente', 'Programa'),
(1, 10, 'Estructura Administrativa y Financiera', '1.0', 'Pendiente', 'Programa');

-- 10. Campos Dinámicos para la Condición 1 (Denominación del Programa - CondicionID = 1)
INSERT INTO campos_dinamicos (CondicionID, TipoControl, ClaveCampo, Etiqueta, Seccion, Orden, Requerido, ConfigJSON) VALUES
(1, 'text', 'nombre_programa_meta', 'Nombre del Programa (Validado)', 'General', 1, 1, NULL),
(1, 'select', 'factor', 'Factor Asociado', 'Calidad', 2, 1, '{"catalogoID": "factores_calidad"}'),
(1, 'textarea', 'justificacion_txt', 'Resumen de Justificación', 'Contenido', 3, 0, NULL),
(1, 'table', 'competencias_tabla', 'Matriz de Competencias', 'Académico', 4, 1, '{"columns": ["codigo", "descripcion", "nivel"]}'),
(1, 'file', 'soporte_legal', 'Acta de Aprobación (PDF)', 'Soportes', 5, 1, NULL);

-- 11. Factores de Calidad
INSERT INTO factores (Nombre, Descripcion) VALUES
('Factor 1: Proyecto Educativo e Identidad Institucional', 'Aspectos de visión, misión y coherencia curricular institucional'),
('Factor 2: Estudiantes', 'Mecanismos de ingreso, permanencia y graduación oportuna'),
('Factor 3: Profesores', 'Desarrollo docente, escalafón y cualificación académica'),
('Factor 4: Procesos Académicos', 'Lineamientos formativos, currículo e interdisciplinariedad');

-- 12. Características de Calidad
INSERT INTO caracteristicas (FactorID, Nombre, Descripcion) VALUES
(1, 'Misión y Proyecto Institucional', 'Divulgación y apropiación de los pilares institucionales'),
(2, 'Procesos de Selección y Admisión', 'Transparencia y equidad en el ingreso de estudiantes'),
(3, 'Cualificación del Profesorado', 'Títulos de posgrados e idoneidad docente en sus áreas respectivas');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
