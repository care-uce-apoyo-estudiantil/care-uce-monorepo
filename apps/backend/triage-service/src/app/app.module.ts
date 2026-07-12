// Location: apps/backend/triage-service/src/app/app.module.ts
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TriageModule } from './triage/triage.module';

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
        // synchronize: true should only be used in local development or QA environments
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TriageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Enable logger middleware for all routes within the Triage Service
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
