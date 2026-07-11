// Location: apps/care-uce-mobile/src/services/appointmentService.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fix TS error in React Native environment where `process` isn't defined in types
declare const process: { env?: { EXPO_PUBLIC_API_URL?: string } } | undefined;

// 🌍 IPs de tus microservicios (ajústalas a tu entorno real si es necesario)
//const APPOINTMENT_API_URL = 'http://100.28.235.67/api';
//const APPOINTMENT_API_URL = 'http://careuce-alb-prod-1635245767.us-east-1.elb.amazonaws.com/api';

//const AUTH_API_URL = 'http://100.28.235.67/api';
//const AUTH_API_URL = 'http://careuce-alb-prod-1635245767.us-east-1.elb.amazonaws.com/api';

const AUTH_API_URL = `${process?.env?.EXPO_PUBLIC_API_URL ?? 'http://localhost'}:3000/api`; // Local (Your physical IP)
const APPOINTMENT_API_URL = `${process?.env?.EXPO_PUBLIC_API_URL ?? 'http://localhost'}:3002/api`; // Local (Your physical IP)

export interface Doctor {
  id: string;
  nombre: string;
  email: string;
  role: string;
  specialty?: string;
}

export interface AppointmentPayload {
  studentName: string;
  studentEmail: string;
  doctorName: string;
  scheduledAt: string;
}

class AppointmentService {
  private async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }

  // 🔥 1. Fetch Real Doctors from the Database (Filtered by Specialty)
  async getAvailableDoctors(specialty?: string): Promise<Doctor[]> {
    try {
      // Append specialty query parameter if provided
      const url = specialty
        ? `${AUTH_API_URL}/auth/doctors?specialty=${encodeURIComponent(specialty)}`
        : `${AUTH_API_URL}/auth/doctors`;

      const response = await axios.get<Doctor[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw new Error('No se pudieron cargar los especialistas.');
    }
  }

  // 🔥 2. Send Booking to Appointments Microservice
  async bookAppointment(payload: AppointmentPayload): Promise<void> {
    try {
      const token = await this.getAuthToken();
      await axios.post(`${APPOINTMENT_API_URL}/appointments`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw new Error('No se pudo procesar la solicitud de cita.');
    }
  }

  // 🔥 NEW: Fetch Doctor's Agenda to block slots on mobile
  async getDoctorAppointments(
    doctorName: string,
  ): Promise<AppointmentPayload[]> {
    try {
      const response = await axios.get<AppointmentPayload[]>(
        `${APPOINTMENT_API_URL}/appointments?doctorName=${encodeURIComponent(doctorName)}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      return [];
    }
  }
}

export default new AppointmentService();
