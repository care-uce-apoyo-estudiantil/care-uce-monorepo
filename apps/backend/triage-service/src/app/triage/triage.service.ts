// Location: apps/backend/triage-service/src/app/triage/triage.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TriageEntity } from './entities/triage.entity';
import { CreateTriageDto } from './dto/create-triage.dto';

// 🔥 FIX: Exported the interface so the Controller can use it publicly without TS errors
export interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

@Injectable()
export class TriageService {
  // Fast In-Memory Storage for real-time chat bridging
  private chatStore: Record<string, ChatMessage[]> = {};

  constructor(
    @InjectRepository(TriageEntity)
    private readonly triageRepository: Repository<TriageEntity>,
  ) {}

  async create(createTriageDto: CreateTriageDto): Promise<TriageEntity> {
    const newTriage = this.triageRepository.create(createTriageDto);
    const saved = await this.triageRepository.save(newTriage);

    // Initialize secure chat channel
    this.chatStore[saved.id] = [
      {
        id: Math.random().toString(36).substring(2, 10),
        text: `Alerta registrada: ${saved.patientName} (${saved.academicMajor}). Razón: ${saved.crisisReason}`,
        sender: 'system',
        timestamp: new Date(),
      },
    ];
    return saved;
  }

  async findAllActive(): Promise<TriageEntity[]> {
    return await this.triageRepository.find({
      where: { caseStatus: 'Pendiente' },
      order: { createdAt: 'ASC' },
    });
  }

  async findAllResolved(): Promise<TriageEntity[]> {
    return await this.triageRepository.find({
      where: { caseStatus: 'Resuelto' },
      order: { updatedAt: 'DESC' },
    });
  }

  async updateStatus(
    id: string,
    newStatus: 'Pendiente' | 'En Proceso' | 'Resuelto',
    notes?: string,
  ): Promise<TriageEntity> {
    const triage = await this.triageRepository.findOne({ where: { id } });

    if (!triage) {
      throw new NotFoundException(
        `Triage record with ID ${id} not found in the database.`,
      );
    }

    triage.caseStatus = newStatus;
    if (notes) {
      // 🔥 FIX: Replaced 'any' cast with Object.assign to satisfy ESLint strict rules
      Object.assign(triage, { resolutionNotes: notes });
    }
    return await this.triageRepository.save(triage);
  }

  // Chat Methods
  async getChatMessages(triageId: string): Promise<ChatMessage[]> {
    return this.chatStore[triageId] || [];
  }

  async addChatMessage(
    triageId: string,
    sender: string,
    text: string,
  ): Promise<ChatMessage> {
    if (!this.chatStore[triageId]) {
      this.chatStore[triageId] = [];
    }
    const msg = {
      id: Math.random().toString(36).substring(2, 10),
      text,
      sender,
      timestamp: new Date(),
    };
    this.chatStore[triageId].push(msg);
    return msg;
  }
}
