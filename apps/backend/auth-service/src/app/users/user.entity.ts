import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users') // Table name in PostgreSQL
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'full_name' })
  full_name!: string;

  @Column({ name: 'id_card', unique: true, length: 10 })
  id_card!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'is_email_verified', default: false })
  is_email_verified!: boolean; // False by default, needs verification for @gmail.com

  @Column()
  password_hash!: string; // Encrypted password

  @Column({ default: 'student' }) // Roles: student, health_professional, control_personnel, admin
  role!: string;

  @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
