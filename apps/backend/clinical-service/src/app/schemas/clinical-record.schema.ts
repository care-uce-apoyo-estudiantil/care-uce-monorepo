import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClinicalRecordDocument = ClinicalRecord & Document;

@Schema({ timestamps: true })
export class ClinicalRecord {
  @Prop({ required: true })
  studentId!: string;

  @Prop({ required: true })
  triageId!: string;

  @Prop({ required: true })
  riskLevel!: string;

  @Prop({ default: 'PENDING_ASSIGNMENT' })
  status!: string; // PENDING_ASSIGNMENT, IN_TREATMENT, CLOSED

  @Prop({ type: Object })
  psychologicalNotes!: Record<string, any>; // Estructura flexible para notas del psicólogo
}

export const ClinicalRecordSchema =
  SchemaFactory.createForClass(ClinicalRecord);
