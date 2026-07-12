import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointment.entity';

type MockRepo = Partial<Record<keyof Repository<Appointment>, jest.Mock>>;

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let repo: MockRepo;

  const baseAppointment: Appointment = {
    id: 'appt-1',
    studentName: 'Ana Pérez',
    studentEmail: 'ana@uce.edu.ec',
    doctorName: 'Dr. Gómez',
    scheduledAt: new Date('2026-01-10T10:00:00Z'),
    status: 'Scheduled',
    sessionNotes: '',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: getRepositoryToken(Appointment), useValue: repo },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('createAppointment', () => {
    it('creates a new appointment converting the scheduled date', async () => {
      const input = {
        studentName: 'Ana Pérez',
        studentEmail: 'ana@uce.edu.ec',
        doctorName: 'Dr. Gómez',
        scheduledAt: '2026-01-10T10:00:00Z',
      };
      (repo.create as jest.Mock).mockReturnValue({
        ...input,
        scheduledAt: new Date(input.scheduledAt),
      });
      (repo.save as jest.Mock).mockResolvedValue(baseAppointment);

      const result = await service.createAppointment(input);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          studentName: input.studentName,
          scheduledAt: new Date(input.scheduledAt),
        }),
      );
      expect(result).toEqual(baseAppointment);
    });
  });

  describe('getAppointmentsByDoctor', () => {
    it('returns scheduled appointments for the given doctor', async () => {
      (repo.find as jest.Mock).mockResolvedValue([baseAppointment]);

      const result = await service.getAppointmentsByDoctor('Dr. Gómez');

      expect(repo.find).toHaveBeenCalledWith({
        where: { doctorName: 'Dr. Gómez', status: 'Scheduled' },
        order: { scheduledAt: 'ASC' },
      });
      expect(result).toEqual([baseAppointment]);
    });
  });

  describe('completeAppointment', () => {
    it('throws NotFoundException when the appointment does not exist', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.completeAppointment('missing-id', 'notes'),
      ).rejects.toThrow(NotFoundException);
    });

    it('marks the appointment as completed with session notes', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ ...baseAppointment });
      (repo.save as jest.Mock).mockImplementation((a) => Promise.resolve(a));

      const result = await service.completeAppointment(
        baseAppointment.id,
        'Paciente estable',
      );

      expect(result.status).toBe('Completed');
      expect(result.sessionNotes).toBe('Paciente estable');
    });
  });

  describe('updateAppointmentStatus', () => {
    it('throws NotFoundException when the appointment does not exist', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateAppointmentStatus('missing-id', 'Cancelled'),
      ).rejects.toThrow(NotFoundException);
    });

    it('updates the appointment status', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ ...baseAppointment });
      (repo.save as jest.Mock).mockImplementation((a) => Promise.resolve(a));

      const result = await service.updateAppointmentStatus(
        baseAppointment.id,
        'Cancelled',
      );

      expect(result.status).toBe('Cancelled');
    });
  });
});
