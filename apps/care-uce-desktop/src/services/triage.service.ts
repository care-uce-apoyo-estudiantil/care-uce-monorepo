// Location: apps/care-uce-desktop/src/services/triage.service.ts
import axios from 'axios';
import { PatientRecord } from '../types/clinical';

interface TriageApiAlert {
  id: string;
  studentName?: string;
  studentAge?: number;
  studentMajor?: string;
  crisisReason?: string;
  priorityLevel?: string;
  status?: string;
  createdAt?: string;
}

// Asumimos que tu triage-service corre en el puerto 3001
const TRIAGE_API_URL =
  import.meta.env.VITE_TRIAGE_API_URL || 'http://localhost:3001/api';

class TriageService {
  async getActiveCases(): Promise<PatientRecord[]> {
    try {
      const response = await axios.get(`${TRIAGE_API_URL}/triage/active`);

      // Mapeamos los datos reales del backend al formato que espera la UI
      return response.data.map((alert: TriageApiAlert) => ({
        id: alert.id,
        paciente: alert.studentName || 'Estudiante Anónimo',
        edad: alert.studentAge || 20, // Idealmente el backend lo enviaría
        carrera: alert.studentMajor || 'No especificada',
        motivo: alert.crisisReason || 'Alerta de Pánico',
        prioridad: alert.priorityLevel || 'Alta',
        estado: alert.status || 'En Proceso',
        // Guardamos la fecha real de creación para calcular el tiempo después
        fechaAtencion: alert.createdAt,
        tiempoEspera: 'Calculando...', // Se calculará en vivo en la UI
      }));
    } catch (error) {
      console.error('Error fetching real triage cases:', error);
      // Retornamos vacío si falla, o podrías retornar casos simulados si el backend está caído
      return [];
    }
  }

  // Opcional: Función para resolver/completar una alerta
  async resolveCase(id: string, notes: string): Promise<void> {
    try {
      await axios.patch(`${TRIAGE_API_URL}/triage/${id}/resolve`, {
        resolutionNotes: notes,
      });
    } catch (error) {
      console.error('Error resolving case:', error);
      throw new Error('No se pudo resolver el caso.');
    }
  }
}

export default new TriageService();
