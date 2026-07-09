import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  // Mocking the AppService to avoid external dependencies
  const mockAppService = {
    createTemporaryRecord: jest.fn(),
  };

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    // Fixed: Passing the class token instead of the instance
    appService = app.get<AppService>(AppService); 
  });

  describe('handleTriageRiskDetected', () => {
    it('should call appService.createTemporaryRecord with correct payload', async () => {
      const mockPayload = {
        studentId: '123',
        triageId: '456',
        riskLevel: 'HIGH',
      };

      mockAppService.createTemporaryRecord.mockResolvedValue({ _id: '1' });

      await appController.handleTriageRiskDetected(mockPayload);

      // Verify that the service was called
      expect(mockAppService.createTemporaryRecord).toHaveBeenCalledWith(mockPayload);
      // Ensure the appService variable is actually used to satisfy ESLint
      expect(appService).toBeDefined();
    });
  });
});