// Location: apps/backend/triage-service/src/app/triage/entities/triage.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('triage_cases')
export class TriageEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  patientName!: string;

  @Column({ type: 'int' })
  patientAge!: number;

  @Column({ type: 'varchar', length: 100 })
  academicMajor!: string;

  @Column({ type: 'text' })
  crisisReason!: string;

  @Column({ type: 'varchar', length: 20, default: 'Media' })
  priorityLevel!: 'Alta' | 'Media' | 'Baja';

  @Column({ type: 'varchar', length: 20, default: 'Pendiente' })
  caseStatus!: 'Pendiente' | 'En Proceso' | 'Resuelto';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
