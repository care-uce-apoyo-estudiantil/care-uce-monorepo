// Location: apps/care-uce-mobile/src/services/triageService.ts
import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

declare const process: { env: { EXPO_PUBLIC_API_URL?: string } } | undefined;

// Note: Triage service runs on port 3001 locally.
// Replace IP with your actual physical IP (e.g., 10.10.12.162)
//const TRIAGE_API_URL = 'http://100.28.235.67:3001/api';
const TRIAGE_API_URL = `${process?.env?.EXPO_PUBLIC_API_URL ?? 'http://localhost'}:3001/api`;

export interface EmergencyPayload {
  patientName: string;
  patientAge: number;
  academicMajor: string;
  crisisReason: string;
  priorityLevel: 'Alta' | 'Media' | 'Baja';
}

class TriageService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: TRIAGE_API_URL,
      timeout: 10000,
    });

    // Automatically attach JWT token for secure requests
    this.api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Triggers a panic button emergency to the backend
   */
  async triggerEmergency(reason: string): Promise<void> {
    try {
      // 1. Get current logged-in user data
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;

      const studentName = user?.nombre || user?.email || 'Anonymous Student';

      // 2. Build the payload matching the NestJS DTO
      const payload: EmergencyPayload = {
        patientName: studentName,
        patientAge: 20, // Default for now, can be extracted from profile later
        academicMajor: 'Software Engineering', // Default for now
        crisisReason: reason || 'Panic button activated from mobile app',
        priorityLevel: 'Alta', // Panic button is always High Priority
      };

      // 3. Send the POST request to the Triage Service
      await this.api.post('/triage', payload);
    } catch (error) {
      console.error('Error triggering emergency:', error);
      throw new Error(
        'Could not send the emergency alert to the clinical staff.',
      );
    }
  }
}

export default new TriageService();
