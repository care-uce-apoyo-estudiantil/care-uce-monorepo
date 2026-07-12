// Location: apps/backend/triage-service/src/app/triage/triage.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TriageEntity } from './entities/triage.entity';
import { CreateTriageDto } from './dto/create-triage.dto';

@Injectable()
export class TriageService {
  constructor(
    @InjectRepository(TriageEntity)
    private readonly triageRepository: Repository<TriageEntity>,
  ) {}

  /**
   * Creates a new emergency triage ticket triggered from the mobile application.
   */
  async create(createTriageDto: CreateTriageDto): Promise<TriageEntity> {
    const newTriage = this.triageRepository.create(createTriageDto);
    return await this.triageRepository.save(newTriage);
  }

  /**
   * Retrieves all active (pending) cases for the Desktop Clinical Dashboard.
   * Ordered dynamically by creation date to calculate waiting time properly on the client side.
   */
  async findAllActive(): Promise<TriageEntity[]> {
    return await this.triageRepository.find({
      where: { caseStatus: 'Pendiente' },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Updates the status of a triage ticket when a clinical psychologist assigns or resolves it.
   */
  async updateStatus(
    id: string,
    newStatus: 'Pendiente' | 'En Proceso' | 'Resuelto',
  ): Promise<TriageEntity> {
    const triage = await this.triageRepository.findOne({ where: { id } });

    if (!triage) {
      throw new NotFoundException(
        `Triage record with ID ${id} not found in the database.`,
      );
    }

    triage.caseStatus = newStatus;
    return await this.triageRepository.save(triage);
  }
}
