import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTriageDto } from './dto/create-triage.dto';
import { UpdateTriageDto } from './dto/update-triage.dto';
import { Triage, RiskLevel } from './entities/triage.entity';

@Injectable()
export class TriageService {
  constructor(
    @InjectRepository(Triage)
    private readonly triageRepository: Repository<Triage>,
    // Inyectamos Kafka usando el nombre que definimos en el módulo
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async create(studentId: string, createTriageDto: CreateTriageDto) {
    let totalScore = 0;
    const answers = createTriageDto.answers;

    for (const key in answers) {
      if (typeof answers[key] === 'number') {
        totalScore += answers[key];
      }
    }

    let risk = RiskLevel.LOW;
    if (totalScore >= 20) risk = RiskLevel.CRITICAL;
    else if (totalScore >= 15) risk = RiskLevel.HIGH;
    else if (totalScore >= 10) risk = RiskLevel.MODERATE;

    const newTriage = this.triageRepository.create({
      studentId: studentId,
      answers: answers,
      score: totalScore,
      riskLevel: risk,
    });

    const savedTriage = await this.triageRepository.save(newTriage);

    // 🔥 PATRÓN EVENT-DRIVEN: Emisión del evento inmutable
    if (risk === RiskLevel.CRITICAL || risk === RiskLevel.HIGH) {
      this.kafkaClient.emit('triage.risk.detected', {
        studentId: savedTriage.studentId,
        triageId: savedTriage.id,
        riskLevel: savedTriage.riskLevel,
        timestamp: savedTriage.createdAt || new Date().toISOString(),
      });
    }

    return savedTriage;
  }

  async findAll() {
    return await this.triageRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return await this.triageRepository.findOne({ where: { id } });
  }

  async findByStudent(studentId: string) {
    return await this.triageRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateTriageDto: UpdateTriageDto) {
    return `This action updates a #${id} triage`;
  }

  async remove(id: string) {
    return await this.triageRepository.delete(id);
  }
}
