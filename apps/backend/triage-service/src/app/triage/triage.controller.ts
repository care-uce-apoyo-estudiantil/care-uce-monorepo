// Location: apps/backend/triage-service/src/app/triage/triage.controller.ts
import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { TriageService } from './triage.service';
import { CreateTriageDto } from './dto/create-triage.dto';
import { TriageEntity } from './entities/triage.entity';

@Controller('triage')
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  /**
   * POST /api/triage
   * Endpoint used by the Mobile App (Students) to trigger an emergency.
   */
  @Post()
  async create(
    @Body() createTriageDto: CreateTriageDto,
  ): Promise<TriageEntity> {
    return await this.triageService.create(createTriageDto);
  }

  /**
   * GET /api/triage/active
   * Endpoint used by the Desktop App (Psychologists) to populate the Inbox.
   */
  @Get('active')
  async findAllActive(): Promise<TriageEntity[]> {
    return await this.triageService.findAllActive();
  }

  /**
   * PATCH /api/triage/:id/status
   * Endpoint used by the Desktop App to accept or resolve a case.
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'Pendiente' | 'En Proceso' | 'Resuelto',
  ): Promise<TriageEntity> {
    return await this.triageService.updateStatus(id, status);
  }
}
