// Location: apps/backend/triage-service/src/app/triage/triage.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TriageService } from './triage.service';
import { TriageController } from './triage.controller';
import { TriageEntity } from './entities/triage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TriageEntity])],
  controllers: [TriageController],
  providers: [TriageService],
})
export class TriageModule {}
