import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(
    @Body()
    body: {
      studentName: string;
      studentEmail: string;
      doctorName: string;
      scheduledAt: string;
    },
  ) {
    return this.appointmentsService.createAppointment(body);
  }

  @Get()
  async findByDoctor(@Query('doctorName') doctorName: string) {
    return this.appointmentsService.getAppointmentsByDoctor(doctorName);
  }

  @Patch(':id/complete')
  async complete(@Param('id') id: string, @Body('notes') notes: string) {
    return this.appointmentsService.completeAppointment(id, notes);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.appointmentsService.updateAppointmentStatus(id, status);
  }
}
