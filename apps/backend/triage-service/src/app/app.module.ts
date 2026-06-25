import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('TRIAGE_DB_HOST') || 'postgres-triage',
        port: configService.get<number>('TRIAGE_DB_PORT') || 5432,
        username: configService.get<string>('TRIAGE_DB_USER') || 'postgres',
        password: configService.get<string>('TRIAGE_DB_PASSWORD') || 'root',
        database: configService.get<string>('TRIAGE_DB_NAME') || 'triage_db',
        autoLoadEntities: true,
        synchronize: true, // Solo para desarrollo local/QA
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
