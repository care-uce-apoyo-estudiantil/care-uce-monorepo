import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ClinicalRecord,
  ClinicalRecordDocument,
} from './schemas/clinical-record.schema';

// Strict interface for the payload to avoid implicit any/type errors
interface TriagePayload {
  studentId: string;
  triageId: string;
  riskLevel: string;
  createdAt: Date;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectModel(ClinicalRecord.name)
    private readonly clinicalRecordModel: Model<ClinicalRecordDocument>,
  ) {}

  async createTemporaryRecord(
    payload: Omit<TriagePayload, 'createdAt'>,
  ): Promise<ClinicalRecordDocument> {
    const dataToSave: TriagePayload = {
      ...payload,
      createdAt: new Date(),
    };

    this.logger.log(
      `Creating clinical record for student: ${dataToSave.studentId}`,
    );

    // Create the record and explicitly cast the result as the Document type
    const savedRecord = await this.clinicalRecordModel.create(dataToSave);

    this.logger.log(
      `✅ Record successfully created in MongoDB with ID: ${savedRecord._id}`,
    );

    return savedRecord;
  }
}
