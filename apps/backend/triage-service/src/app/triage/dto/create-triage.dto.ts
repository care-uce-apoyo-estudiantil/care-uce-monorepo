import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateTriageDto {
  @IsNotEmpty()
  @IsObject()
  answers!: Record<string, any>;
}
