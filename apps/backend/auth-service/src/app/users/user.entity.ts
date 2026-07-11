// Location: apps/backend/auth-service/src/app/users/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  // The hashed password used for authentication flows
  @Column()
  password_hash!: string;

  // Role-Based Access Control (student, doctor, admin, auditor)
  @Column({ default: 'student' })
  role!: string;

  // Full identity name of the user
  @Column({ nullable: true })
  nombre!: string;

  // Added unique constraint to enforce identification document integrity at DB level
  @Column({ unique: true, nullable: true })
  cedula!: string;

  // Clinical specialty for routing mobile appointments (e.g., Psicología Clínica)
  @Column({ nullable: true })
  specialty!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
