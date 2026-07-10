// Location: apps/care-uce-desktop/src/services/triage.service.ts
import axios from 'axios';
import { PatientRecord } from '../types/clinical';

const TRIAGE_API_URL = `${import.meta.env.VITE_BASE_IP}:3001/api`;

class TriageService {
  async getActiveCases(): Promise<PatientRecord[]> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${TRIAGE_API_URL}/triage/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      interface ApiTriageItem {
        id: string;
        patientName: string;
        patientAge?: number | string;
        academicMajor?: string;
        crisisReason?: string;
        priorityLevel?: string;
        caseStatus?: string;
        createdAt?: string;
      }

      return (response.data as ApiTriageItem[]).map((item) => {
        const estado =
          item.caseStatus === 'Completado' ||
          item.caseStatus === 'En Proceso' ||
          item.caseStatus === 'Derivado'
            ? (item.caseStatus as 'Completado' | 'En Proceso' | 'Derivado')
            : 'En Proceso';

        return {
          id: item.id,
          paciente: item.patientName,
          edad:
            typeof item.patientAge === 'number'
              ? item.patientAge
              : Number(item.patientAge ?? 0) || 0,
          carrera: item.academicMajor || '',
          motivo: item.crisisReason || '',
          prioridad:
            item.priorityLevel === 'Alta' ||
            item.priorityLevel === 'Media' ||
            item.priorityLevel === 'Baja'
              ? (item.priorityLevel as 'Alta' | 'Media' | 'Baja')
              : 'Baja',
          tiempoEspera: 'Reciente',
          estado,
          fechaAtencion: item.createdAt || '',
        };
      });
    } catch (error) {
      console.error('Error fetching active triage cases:', error);
      throw new Error('No se pudieron cargar los casos de triage.');
    }
  }

  // 🔥 NUEVO: Método para finalizar la atención y guardar las notas del doctor
  async resolveCase(id: string, notes: string): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.patch(
        `${TRIAGE_API_URL}/triage/${id}/status`,
        {
          status: 'Resolved',
          clinicalNotes: notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      console.error('Error resolving triage case:', error);
      throw new Error('No se pudo finalizar la atención.');
    }
  }
}

export default new TriageService();
