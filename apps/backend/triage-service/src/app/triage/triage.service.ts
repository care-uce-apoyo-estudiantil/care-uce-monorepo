import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';

import { CreateTriageDto } from './dto/create-triage.dto';
import { UpdateTriageDto } from './dto/update-triage.dto';
import { Triage, RiskLevel } from './entities/triage.entity';

@Injectable()
export class TriageService implements OnModuleInit {
  private readonly logger = new Logger(TriageService.name);
  
  // Variable para almacenar las funciones exportadas de WebAssembly
  private triageEngine: any = null;

  constructor(
    @InjectRepository(Triage)
    private readonly triageRepository: Repository<Triage>,
    // Inyectamos Kafka usando el nombre que definimos en el módulo
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  // 🔥 Inicialización de WebAssembly al arrancar el microservicio
  async onModuleInit() {
    try {
      const wasmPath = path.join(process.cwd(), 'apps/backend/triage-service/src/assets/triage-engine.wasm');
      
      // Verificamos si el binario existe antes de leerlo
      if (fs.existsSync(wasmPath)) {
        const wasmBuffer = fs.readFileSync(wasmPath);
        const wasmModule = await WebAssembly.instantiate(wasmBuffer, {
          env: {
            abort: (msg: any, file: any, line: number, column: number) => {
              this.logger.error(`Abortado en Wasm: ${file}:${line}:${column}`);
            },
          },
        });

        this.triageEngine = wasmModule.instance.exports;
        this.logger.log('🚀 Motor de Triaje WebAssembly cargado exitosamente en memoria.');
      } else {
        this.logger.warn('⚠️ Archivo .wasm no encontrado. Se usará el fallback nativo.');
      }
    } catch (error) {
      this.logger.error('❌ Error al instanciar WebAssembly.', error);
    }
  }

  async create(studentId: string, createTriageDto: CreateTriageDto) {
    let totalScore = 0;
    const answers = createTriageDto.answers;

    for (const key in answers) {
      if (typeof answers[key] === 'number') {
        totalScore += answers[key];
      }
    }

    let risk = RiskLevel.LOW;

    // 🔥 Evaluación del riesgo delegada a WebAssembly
    if (this.triageEngine) {
      const riskCode = this.triageEngine.evaluateRiskLevel(totalScore);
      
      switch (riskCode) {
        case 3: risk = RiskLevel.CRITICAL; break;
        case 2: risk = RiskLevel.HIGH; break;
        case 1: risk = RiskLevel.MODERATE; break;
        default: risk = RiskLevel.LOW; break;
      }
    } else {
      // Fallback de seguridad en TypeScript puro
      if (totalScore >= 20) risk = RiskLevel.CRITICAL;
      else if (totalScore >= 15) risk = RiskLevel.HIGH;
      else if (totalScore >= 10) risk = RiskLevel.MODERATE;
    }

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