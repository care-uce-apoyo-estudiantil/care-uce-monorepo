import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TriageService } from './triage.service';
import { TriageEntity } from './entities/triage.entity';
import { CreateTriageDto } from './dto/create-triage.dto';

type MockRepo = Partial<Record<keyof Repository<TriageEntity>, jest.Mock>>;

describe('TriageService', () => {
  let service: TriageService;
  let repo: MockRepo;

  const baseTriage: TriageEntity = {
    id: 'triage-1',
    patientName: 'Juan Pérez',
    patientAge: 20,
    academicMajor: 'Sistemas',
    crisisReason: 'Ansiedad severa',
    priorityLevel: 'Alta',
    caseStatus: 'Pendiente',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
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
        TriageService,
        { provide: getRepositoryToken(TriageEntity), useValue: repo },
      ],
    }).compile();

    service = module.get<TriageService>(TriageService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('creates and persists a new triage case', async () => {
      const dto = new CreateTriageDto(
        'Juan Pérez',
        20,
        'Sistemas',
        'Ansiedad severa',
        'Alta',
      );
      (repo.create as jest.Mock).mockReturnValue(dto);
      (repo.save as jest.Mock).mockResolvedValue(baseTriage);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual(baseTriage);
    });
  });

  describe('findAllActive', () => {
    it('returns only pending cases ordered by creation date', async () => {
      (repo.find as jest.Mock).mockResolvedValue([baseTriage]);

      const result = await service.findAllActive();

      expect(repo.find).toHaveBeenCalledWith({
        where: { caseStatus: 'Pendiente' },
        order: { createdAt: 'ASC' },
      });
      expect(result).toEqual([baseTriage]);
    });
  });

  describe('updateStatus', () => {
    it('throws NotFoundException when the triage case does not exist', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateStatus('missing-id', 'En Proceso'),
      ).rejects.toThrow(NotFoundException);
    });

    it('updates the case status and persists the change', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ ...baseTriage });
      (repo.save as jest.Mock).mockImplementation((t) => Promise.resolve(t));

      const result = await service.updateStatus(baseTriage.id, 'Resuelto');

      expect(result.caseStatus).toBe('Resuelto');
      expect(repo.save).toHaveBeenCalled();
    });
  });
});
