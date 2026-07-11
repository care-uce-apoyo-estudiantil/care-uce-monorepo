import axios from 'axios';

const APPOINTMENT_API_URL = `${process?.env?.EXPO_PUBLIC_API_URL ?? 'http://localhost'}:3002/api`;

//const APPOINTMENT_API_URL = 'http://100.28.235.67/api';
//const APPOINTMENT_API_URL = 'http://careuce-alb-prod-1635245767.us-east-1.elb.amazonaws.com/api';

export interface AppointmentRecord {
  id: string;
  studentName: string;
  studentEmail: string;
  doctorName: string;
  scheduledAt: string;
  status: string;
}

class AppointmentService {
  async getMyUpcomingAppointments(
    doctorName: string,
  ): Promise<AppointmentRecord[]> {
    try {
      const response = await axios.get(
        `${APPOINTMENT_API_URL}/appointments?doctorName=${doctorName}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw new Error('No se pudo cargar la agenda.');
    }
  }

  async changeStatus(
    id: string,
    status: 'Cancelled' | 'Completed',
  ): Promise<void> {
    try {
      await axios.patch(`${APPOINTMENT_API_URL}/appointments/${id}/status`, {
        status,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      throw new Error('No se pudo actualizar el estado de la cita.');
    }
  }

  // 🔥 NUEVO: Función para bloquear una hora por emergencia/permiso
  async blockTimeSlot(doctorName: string, timeDate: Date): Promise<void> {
    try {
      await axios.post(`${APPOINTMENT_API_URL}/appointments`, {
        studentName: '__BLOCKED__', // Identificador clave para el sistema
        studentEmail: 'sistema@careuce.edu.ec',
        doctorName: doctorName,
        scheduledAt: timeDate.toISOString(),
      });
    } catch (error) {
      console.error('Error blocking slot:', error);
      throw new Error('No se pudo bloquear el horario.');
    }
  }
}

export default new AppointmentService();
