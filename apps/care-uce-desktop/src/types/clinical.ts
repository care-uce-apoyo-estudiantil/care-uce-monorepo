// Location: apps/care-uce-desktop/src/types/clinical.ts

// Defines the structure for a patient in the clinical system
export interface PatientRecord {
  id: string;
  paciente: string;
  edad: number;
  carrera: string;
  motivo: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  tiempoEspera?: string;
  estado?: 'Completado' | 'En Proceso' | 'Derivado';
  fechaAtencion?: string;
}

// Defines the available views in the clinical dashboard
export type DashboardView = 'triage' | 'records' | 'chat';