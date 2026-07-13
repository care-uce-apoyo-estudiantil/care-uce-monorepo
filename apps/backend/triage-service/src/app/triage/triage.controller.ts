// Location: apps/backend/triage-service/src/app/triage/triage.controller.ts
import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
// 🔥 FIX: Imported ChatMessage to strictly type the endpoint returns
import { TriageService, ChatMessage } from './triage.service';
import { CreateTriageDto } from './dto/create-triage.dto';
import { TriageEntity } from './entities/triage.entity';

@Controller('triage')
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  /**
   * POST /api/triage
   * Endpoint utilized by the Mobile App (Students) to trigger an emergency panic alert.
   */
  @Post()
  async create(
    @Body() createTriageDto: CreateTriageDto,
  ): Promise<TriageEntity> {
    return await this.triageService.create(createTriageDto);
  }

  /**
   * GET /api/triage/active
   * Endpoint utilized by the Desktop App (Psychologists) to populate the real-time inbox.
   */
  @Get('active')
  async findAllActive(): Promise<TriageEntity[]> {
    return await this.triageService.findAllActive();
  }

  /**
   * GET /api/triage/resolved
   * Endpoint utilized by the Desktop App to fetch historical/closed clinical records.
   */
  @Get('resolved')
  async findAllResolved(): Promise<TriageEntity[]> {
    return await this.triageService.findAllResolved();
  }

  /**
   * PATCH /api/triage/:id/status
   * Endpoint utilized by the Desktop App to accept or resolve a clinical emergency case.
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'Pendiente' | 'En Proceso' | 'Resuelto',
    @Body('resolutionNotes') notes?: string,
  ): Promise<TriageEntity> {
    return await this.triageService.updateStatus(id, status, notes);
  }

  /**
   * GET /api/triage/:id/chat
   * Fetches real-time chat messages for a specific triage case.
   */
  @Get(':id/chat')
  async getChat(@Param('id') id: string): Promise<ChatMessage[]> {
    return await this.triageService.getChatMessages(id);
  }

  /**
   * POST /api/triage/:id/chat
   * Sends a message to the active emergency channel.
   */
  @Post(':id/chat')
  async addChatMessage(
    @Param('id') id: string,
    @Body() body: { sender: 'patient' | 'doctor' | 'system'; text: string },
  ): Promise<ChatMessage> {
    return await this.triageService.addChatMessage(id, body.sender, body.text);
  }
}
