import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ClinicalRecord,
  ClinicalRecordDocument,
} from './schemas/clinical-record.schema';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectModel(ClinicalRecord.name)
    private clinicalRecordModel: Model<ClinicalRecordDocument>,
  ) {}

  async createTemporaryRecord(payload: any) {
    this.logger.log(
      `Creando expediente clínico para el estudiante: ${payload.studentId}`,
    );

    const newRecord = new this.clinicalRecordModel({
      studentId: payload.studentId,
      triageId: payload.triageId,
      riskLevel: payload.riskLevel,
    });

    const savedRecord = await newRecord.save();
    this.logger.log(
      `✅ Expediente creado exitosamente en MongoDB con ID: ${savedRecord._id}`,
    );
    return savedRecord;
  }
}
