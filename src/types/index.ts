// ═══════════════════════════════════════════════════════
// AutoAlDia — TypeScript Types & Interfaces
// Mirrors the backend DTOs from Spring Boot
// ═══════════════════════════════════════════════════════

// ── Enums (as const objects for erasableSyntaxOnly) ──

export const TipoServicio = {
    CAMBIO_ACEITE: 'CAMBIO_ACEITE',
    CAMBIO_FILTRO_ACEITE: 'CAMBIO_FILTRO_ACEITE',
    CAMBIO_FILTRO_AIRE: 'CAMBIO_FILTRO_AIRE',
    CAMBIO_FILTRO_COMBUSTIBLE: 'CAMBIO_FILTRO_COMBUSTIBLE',
    NEUMATICOS: 'NEUMATICOS',
    ALINEACION_BALANCEO: 'ALINEACION_BALANCEO',
    FRENOS: 'FRENOS',
    BATERIA: 'BATERIA',
    BUJIAS: 'BUJIAS',
    CORREA_DISTRIBUCION: 'CORREA_DISTRIBUCION',
    LIQUIDO_FRENOS: 'LIQUIDO_FRENOS',
    REFRIGERANTE: 'REFRIGERANTE',
    TRANSMISION: 'TRANSMISION',
    SUSPENSION: 'SUSPENSION',
    AIRE_ACONDICIONADO: 'AIRE_ACONDICIONADO',
    REVISION_GENERAL: 'REVISION_GENERAL',
    REPARACION_MOTOR: 'REPARACION_MOTOR',
    REPARACION_ELECTRICA: 'REPARACION_ELECTRICA',
    CHAPA_PINTURA: 'CHAPA_PINTURA',
    OTRO: 'OTRO',
} as const;
export type TipoServicio = (typeof TipoServicio)[keyof typeof TipoServicio];

export const TipoRecordatorio = {
    BASADO_EN_KM: 'BASADO_EN_KM',
    BASADO_EN_FECHA: 'BASADO_EN_FECHA',
    AMBOS: 'AMBOS',
} as const;
export type TipoRecordatorio = (typeof TipoRecordatorio)[keyof typeof TipoRecordatorio];

export const EstadoRecordatorio = {
    PENDIENTE: 'PENDIENTE',
    COMPLETADO: 'COMPLETADO',
    DESCARTADO: 'DESCARTADO',
} as const;
export type EstadoRecordatorio = (typeof EstadoRecordatorio)[keyof typeof EstadoRecordatorio];

export const TipoDocumento = {
    SEGURO: 'SEGURO',
    VTV: 'VTV',
    RTO: 'RTO',
    PATENTE: 'PATENTE',
    LICENCIA: 'LICENCIA',
    CEDULA_VERDE: 'CEDULA_VERDE',
    CEDULA_AZUL: 'CEDULA_AZUL',
    OTRO: 'OTRO',
} as const;
export type TipoDocumento = (typeof TipoDocumento)[keyof typeof TipoDocumento];

// ── Enum Label Maps (for display in UI) ───────────────

export const TipoServicioLabels: Record<TipoServicio, string> = {
    CAMBIO_ACEITE: 'Cambio de aceite',
    CAMBIO_FILTRO_ACEITE: 'Cambio filtro de aceite',
    CAMBIO_FILTRO_AIRE: 'Cambio filtro de aire',
    CAMBIO_FILTRO_COMBUSTIBLE: 'Cambio filtro de combustible',
    NEUMATICOS: 'Neumáticos',
    ALINEACION_BALANCEO: 'Alineación y balanceo',
    FRENOS: 'Frenos',
    BATERIA: 'Batería',
    BUJIAS: 'Bujías',
    CORREA_DISTRIBUCION: 'Correa de distribución',
    LIQUIDO_FRENOS: 'Líquido de frenos',
    REFRIGERANTE: 'Refrigerante',
    TRANSMISION: 'Transmisión',
    SUSPENSION: 'Suspensión',
    AIRE_ACONDICIONADO: 'Aire acondicionado',
    REVISION_GENERAL: 'Revisión general',
    REPARACION_MOTOR: 'Reparación de motor',
    REPARACION_ELECTRICA: 'Reparación eléctrica',
    CHAPA_PINTURA: 'Chapa y pintura',
    OTRO: 'Otro',
};

export const TipoRecordatorioLabels: Record<TipoRecordatorio, string> = {
    BASADO_EN_KM: 'Basado en kilómetros',
    BASADO_EN_FECHA: 'Basado en fecha',
    AMBOS: 'Ambos',
};

export const EstadoRecordatorioLabels: Record<EstadoRecordatorio, string> = {
    PENDIENTE: 'Pendiente',
    COMPLETADO: 'Completado',
    DESCARTADO: 'Descartado',
};

export const TipoDocumentoLabels: Record<TipoDocumento, string> = {
    SEGURO: 'Seguro',
    VTV: 'VTV',
    RTO: 'RTO',
    PATENTE: 'Patente',
    LICENCIA: 'Licencia',
    CEDULA_VERDE: 'Cédula verde',
    CEDULA_AZUL: 'Cédula azul',
    OTRO: 'Otro',
};

// ── Interfaces ────────────────────────────────────────

// Usuario
export interface Usuario {
    id: number;
    email: string;
    nombre: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UsuarioCreate {
    email: string;
    password: string;
    nombre: string;
}

// Vehículo
export interface Vehiculo {
    id: number;
    usuarioId: number;
    marca: string;
    modelo: string;
    anio: number;
    patente: string | null;
    km_actual: number;
    url_foto: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface VehiculoCreate {
    usuarioId: number;
    marca: string;
    modelo: string;
    anio: number;
    patente?: string;
    km_actual: number;
    url_foto?: string;
}

// Mantenimiento
export interface Mantenimiento {
    id: number;
    vehiculoId: number;
    tipoServicio: TipoServicio;
    descripcion: string | null;
    fecha_mantenimiento: string; // "YYYY-MM-DD"
    km_al_servicio: number;
    costo: number | null;
    lugar: string | null;
    url_foto_recibo: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface MantenimientoCreate {
    vehiculoId: number;
    tipoServicio: TipoServicio;
    descripcion?: string;
    fecha_mantenimiento: string;
    km_al_servicio: number;
    costo?: number;
    lugar?: string;
    url_foto_recibo?: string;
}

// Recordatorio Mantenimiento
export interface RecordatorioMantenimiento {
    id: number;
    vehiculoId: number;
    tipoRecordatorio: TipoRecordatorio;
    tipoServicio: TipoServicio;
    recordatorio_km: number | null;
    recordatorio_fecha: string | null; // "YYYY-MM-DD"
    estado: EstadoRecordatorio;
    createdAt: string;
    updatedAt: string;
}

export interface RecordatorioCreate {
    vehiculoId: number;
    tipoRecordatorio: TipoRecordatorio;
    tipoServicio: TipoServicio;
    recordatorio_km?: number;
    recordatorio_fecha?: string;
    estado: EstadoRecordatorio;
}

// Documento
export interface Documento {
    id: number;
    vehiculoId: number;
    tipoDocumento: TipoDocumento;
    fecha_expiro: string; // "YYYY-MM-DD"
    url_foto: string | null;
    notas: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface DocumentoCreate {
    vehiculoId: number;
    tipoDocumento: TipoDocumento;
    fecha_expiro: string;
    url_foto?: string;
    notas?: string;
}
