// Location: apps/backend/triage-service/src/app/triage/dto/create-triage.dto.ts
import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsIn,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreateTriageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  patientName: string;

  @IsInt()
  @Min(16)
  @Max(99)
  patientAge: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  academicMajor: string;

  @IsString()
  @IsNotEmpty()
  crisisReason: string;

  @IsString()
  @IsIn(['Alta', 'Media', 'Baja'])
  priorityLevel: 'Alta' | 'Media' | 'Baja';

  constructor(
    patientName: string,
    patientAge: number,
    academicMajor: string,
    crisisReason: string,
    priorityLevel: 'Alta' | 'Media' | 'Baja',
  ) {
    this.patientName = patientName;
    this.patientAge = patientAge;
    this.academicMajor = academicMajor;
    this.crisisReason = crisisReason;
    this.priorityLevel = priorityLevel;
  }
}
