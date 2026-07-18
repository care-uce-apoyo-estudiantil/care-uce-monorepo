import axios from 'axios';
import { PatientRecord } from '../types/clinical';

// Strict interface matching the backend TriageEntity response
interface TriageResponse {
  id: string;
  patientName: string;
  patientAge: number;
  academicMajor: string;
  crisisReason: string;
  priorityLevel: 'Alta' | 'Media' | 'Baja';
  caseStatus: 'Pendiente' | 'En Proceso' | 'Resuelto';
  createdAt: string;
  updatedAt?: string;
  resolutionNotes?: string;
}

// 🌍 A través del Gateway (Nginx enruta /api/triage -> triage-service internamente)
const TRIAGE_API_URL = `${import.meta.env.VITE_BASE_IP ?? 'http://localhost'}/api`;

class TriageService {
  /**
   * Fetches real-time crisis alerts with strict typing. No ESLint 'any' warnings.
   */
  async getActiveCases(): Promise<PatientRecord[]> {
    try {
      const response = await axios.get<TriageResponse[]>(
        `${TRIAGE_API_URL}/triage/active`,
      );

      return response.data.map((alert: TriageResponse) => {
        return {
          id: String(alert.id),
          // Maps exact database entity parameters to Desktop UI props
          paciente: String(alert.patientName),
          edad: Number(alert.patientAge),
          carrera: String(alert.academicMajor),
          motivo: String(alert.crisisReason),
          prioridad: alert.priorityLevel,
          estado: alert.caseStatus === 'Resuelto' ? 'Completado' : 'En Proceso',
          fechaAtencion: String(alert.createdAt),
          tiempoEspera: 'Calculando...',
        };
      });
    } catch (error) {
      console.error(
        'Error connection packet on triage-service endpoint:',
        error,
      );
      return [];
    }
  }

  /**
   * Fetches the historical repository of resolved cases.
   */
  async getResolvedCases(): Promise<PatientRecord[]> {
    try {
      const response = await axios.get<TriageResponse[]>(
        `${TRIAGE_API_URL}/triage/resolved`,
      );

      return response.data.map((alert: TriageResponse) => {
        return {
          id: String(alert.id),
          paciente: String(alert.patientName),
          edad: Number(alert.patientAge),
          carrera: String(alert.academicMajor),
          motivo: String(alert.crisisReason),
          prioridad: alert.priorityLevel,
          estado: 'Completado',
          fechaAtencion: String(alert.updatedAt || alert.createdAt),
          tiempoEspera: 'N/A',
          notas:
            alert.resolutionNotes || 'Sin anotaciones clínicas registradas.',
        };
      });
    } catch (error) {
      console.error('Error fetching resolved cases:', error);
      return [];
    }
  }

  /**
   * Updates the triage record parameters to flag it as resolved.
   */
  async resolveCase(id: string, notes: string): Promise<void> {
    try {
      await axios.patch(`${TRIAGE_API_URL}/triage/${id}/status`, {
        status: 'Resuelto',
        resolutionNotes: notes,
      });
    } catch (error) {
      console.error('Error patch transaction in triage-service:', error);
      throw new Error('Could not update case status.');
    }
  }

  /**
   * Fetches chat messages for the active session.
   */
  async getChat(id: string) {
    const res = await axios.get(`${TRIAGE_API_URL}/triage/${id}/chat`);
    return res.data;
  }

  /**
   * Sends a new chat message to the active session.
   */
  async sendChatMessage(id: string, text: string) {
    await axios.post(`${TRIAGE_API_URL}/triage/${id}/chat`, {
      sender: 'doctor',
      text,
    });
  }
}

export default new TriageService();
