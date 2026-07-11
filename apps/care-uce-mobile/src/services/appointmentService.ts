// Location: apps/care-uce-mobile/src/services/appointmentService.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fix TS error in React Native environment where `process` isn't defined in types
declare const process: { env?: { EXPO_PUBLIC_API_URL?: string } } | undefined;

// 🌍 A través del Gateway (Nginx enruta /api/auth y /api/appointments a cada
// microservicio internamente), sin puertos directos.
const AUTH_API_URL = `${process?.env?.EXPO_PUBLIC_API_URL ?? 'http://localhost'}/api`;
const APPOINTMENT_API_URL = `${process?.env?.EXPO_PUBLIC_API_URL ?? 'http://localhost'}/api`;

export interface Doctor {
  id: string;
  nombre: string;
  email: string;
  role: string;
}

export interface AppointmentPayload {
  studentName: string;
  studentEmail: string;
  doctorName: string;
  scheduledAt: string;
}

class AppointmentService {
  private async getAuthToken() {
    return await AsyncStorage.getItem('auth_token');
  }

  // 🔥 1. Traer Doctores Reales de la Base de Datos
  async getAvailableDoctors(): Promise<Doctor[]> {
    try {
      const response = await axios.get(`${AUTH_API_URL}/auth/doctors`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw new Error('No se pudieron cargar los especialistas.');
    }
  }

  // 🔥 2. Enviar el Agendamiento al Microservicio de Citas
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
  // 🔥 NUEVO: Traer la agenda del doctor para bloquear horarios en el celular
  async getDoctorAppointments(
    doctorName: string,
  ): Promise<AppointmentPayload[]> {
    try {
      const response = await axios.get(
        `${APPOINTMENT_API_URL}/appointments?doctorName=${doctorName}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      return [];
    }
  }
}

export default new AppointmentService();
