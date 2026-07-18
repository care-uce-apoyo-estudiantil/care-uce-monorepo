// Location: apps/care-uce-web/src/services/triage.service.ts
import axios from 'axios';

// Strict typing reflecting the backend entity
export interface WebTriageEntity {
  id: string;
  patientName: string;
  patientAge: number;
  academicMajor: string;
  crisisReason: string;
  priorityLevel: 'Alta' | 'Media' | 'Baja';
  caseStatus: 'Pendiente' | 'En Proceso' | 'Resuelto';
  createdAt: string;
  updatedAt: string;
}

// Fallback to localhost if ENV is not strictly defined in Vite
const TRIAGE_API_URL =
  import.meta.env.VITE_TRIAGE_API_URL || 'http://localhost:3000/api';

class WebTriageService {
  /**
   * Fetches the entire unified history of triage events (both Active and Resolved).
   * This allows the admin dashboard to perform deep statistical analytics.
   */
  async getAllTriageEvents(): Promise<WebTriageEntity[]> {
    try {
      // Execute parallel requests to gather the complete ecosystem dataset
      const [activeResponse, resolvedResponse] = await Promise.all([
        axios.get<WebTriageEntity[]>(`${TRIAGE_API_URL}/triage/active`),
        axios.get<WebTriageEntity[]>(`${TRIAGE_API_URL}/triage/resolved`),
      ]);

      // Merge active queue and historical records
      const fullDataset = [...activeResponse.data, ...resolvedResponse.data];

      // Sort chronologically (newest first)
      return fullDataset.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } catch (error) {
      console.error('Data Warehouse Sync Error:', error);
      return [];
    }
  }
}

export default new WebTriageService();
