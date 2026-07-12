import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  studentName!: string;

  @Column()
  studentEmail!: string;

  @Column()
  doctorName!: string;

  @Column({ type: 'timestamp' })
  scheduledAt!: Date;

  @Column({ default: 'Scheduled' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  sessionNotes!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
