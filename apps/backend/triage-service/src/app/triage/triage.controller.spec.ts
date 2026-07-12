import { Test, TestingModule } from '@nestjs/testing';
import { TriageController } from './triage.controller';
import { TriageService } from './triage.service';
import { CreateTriageDto } from './dto/create-triage.dto';

describe('TriageController', () => {
  let controller: TriageController;
  let triageService: Partial<Record<keyof TriageService, jest.Mock>>;

  beforeEach(async () => {
    triageService = {
      create: jest.fn(),
      findAllActive: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TriageController],
      providers: [{ provide: TriageService, useValue: triageService }],
    }).compile();

    controller = module.get<TriageController>(TriageController);
  });

  afterEach(() => jest.clearAllMocks());

  it('creates a new triage case', async () => {
    const dto = new CreateTriageDto(
      'Juan Pérez',
      20,
      'Sistemas',
      'Ansiedad severa',
      'Alta',
    );
    (triageService.create as jest.Mock).mockResolvedValue({ id: '1', ...dto });

    const result = await controller.create(dto);

    expect(triageService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: '1', ...dto });
  });

  it('returns all active triage cases', async () => {
    (triageService.findAllActive as jest.Mock).mockResolvedValue([
      { id: '1' },
    ]);

    const result = await controller.findAllActive();

    expect(result).toEqual([{ id: '1' }]);
  });

  it('updates the status of a triage case', async () => {
    (triageService.updateStatus as jest.Mock).mockResolvedValue({
      id: '1',
      caseStatus: 'Resuelto',
    });

    const result = await controller.updateStatus('1', 'Resuelto');

    expect(triageService.updateStatus).toHaveBeenCalledWith('1', 'Resuelto');
    expect(result).toEqual({ id: '1', caseStatus: 'Resuelto' });
  });
});
