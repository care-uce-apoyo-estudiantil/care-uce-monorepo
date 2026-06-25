import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TriageService } from './triage.service';
import { TriageController } from './triage.controller';
import { Triage } from './entities/triage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Triage])],
  controllers: [TriageController],
  providers: [TriageService],
})
export class TriageModule {}
