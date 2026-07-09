import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { ClinicalRecord } from './schemas/clinical-record.schema';

describe('AppService', () => {
  let service: AppService;

  // Mocking the model
  const mockClinicalRecordModel = {
    create: jest.fn(),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getModelToken(ClinicalRecord.name),
          useValue: mockClinicalRecordModel,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  describe('createTemporaryRecord', () => {
    it('should create and return a clinical record', async () => {
      const mockPayload = {
        studentId: '123',
        triageId: '456',
        riskLevel: 'HIGH',
      };

      const mockSavedRecord = {
        _id: 'record-1',
        ...mockPayload,
        createdAt: new Date(),
      };

      mockClinicalRecordModel.create.mockResolvedValue(mockSavedRecord);

      const result = await service.createTemporaryRecord(mockPayload);

      expect(result).toBeDefined();
      expect(result._id).toBe('record-1');
      expect(mockClinicalRecordModel.create).toHaveBeenCalled();
    });
  });
});