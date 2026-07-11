import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async createAppointment(data: {
    studentName: string;
    studentEmail: string;
    doctorName: string;
    scheduledAt: string;
  }): Promise<Appointment> {
    const newAppointment = this.appointmentRepository.create({
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      doctorName: data.doctorName,
      scheduledAt: new Date(data.scheduledAt),
    });
    return await this.appointmentRepository.save(newAppointment);
  }

  async getAppointmentsByDoctor(doctorName: string): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { doctorName, status: 'Scheduled' },
      order: { scheduledAt: 'ASC' },
    });
  }

  async completeAppointment(id: string, notes: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    appointment.status = 'Completed';
    appointment.sessionNotes = notes;
    return await this.appointmentRepository.save(appointment);
  }

  async updateAppointmentStatus(
    id: string,
    status: string,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) throw new NotFoundException('Cita no encontrada');

    appointment.status = status;
    return await this.appointmentRepository.save(appointment);
  }
}
