import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: Partial<Record<keyof AppointmentsService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      createAppointment: jest.fn(),
      getAppointmentsByDoctor: jest.fn(),
      completeAppointment: jest.fn(),
      updateAppointmentStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [{ provide: AppointmentsService, useValue: service }],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('creates an appointment', async () => {
    const body = {
      studentName: 'Ana',
      studentEmail: 'ana@uce.edu.ec',
      doctorName: 'Dr. Gómez',
      scheduledAt: '2026-01-10T10:00:00Z',
    };
    (service.createAppointment as jest.Mock).mockResolvedValue({ id: '1' });

    const result = await controller.create(body);

    expect(service.createAppointment).toHaveBeenCalledWith(body);
    expect(result).toEqual({ id: '1' });
  });

  it('finds appointments by doctor', async () => {
    (service.getAppointmentsByDoctor as jest.Mock).mockResolvedValue([
      { id: '1' },
    ]);

    const result = await controller.findByDoctor('Dr. Gómez');

    expect(service.getAppointmentsByDoctor).toHaveBeenCalledWith(
      'Dr. Gómez',
    );
    expect(result).toEqual([{ id: '1' }]);
  });

  it('completes an appointment', async () => {
    (service.completeAppointment as jest.Mock).mockResolvedValue({
      id: '1',
      status: 'Completed',
    });

    const result = await controller.complete('1', 'Notas de la sesión');

    expect(service.completeAppointment).toHaveBeenCalledWith(
      '1',
      'Notas de la sesión',
    );
    expect(result).toEqual({ id: '1', status: 'Completed' });
  });

  it('updates the appointment status', async () => {
    (service.updateAppointmentStatus as jest.Mock).mockResolvedValue({
      id: '1',
      status: 'Cancelled',
    });

    const result = await controller.updateStatus('1', 'Cancelled');

    expect(service.updateAppointmentStatus).toHaveBeenCalledWith(
      '1',
      'Cancelled',
    );
    expect(result).toEqual({ id: '1', status: 'Cancelled' });
  });
});
