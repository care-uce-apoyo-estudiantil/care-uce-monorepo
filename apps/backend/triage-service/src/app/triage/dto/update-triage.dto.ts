import { PartialType } from '@nestjs/mapped-types';
import { CreateTriageDto } from './create-triage.dto';

export class UpdateTriageDto extends PartialType(CreateTriageDto) {}
