import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TriageService } from './triage.service';
import { TriageController } from './triage.controller';
import { Triage } from './entities/triage.entity';
import { JwtStrategy } from '@org/shared-auth';

@Module({
  imports: [TypeOrmModule.forFeature([Triage])],
  controllers: [TriageController],
  providers: [TriageService, JwtStrategy],
})
export class TriageModule {}
