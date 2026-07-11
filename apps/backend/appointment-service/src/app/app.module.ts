import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppointmentsModule } from './appointments/appointments.module';
import { Appointment } from './appointments/appointment.entity';

@Module({
  imports: [
    // Mismo patrón que auth-service: intenta .env.<NODE_ENV> y cae a .env.
    // En el contenedor de AWS ninguno de los dos existe en el filesystem:
    // las variables reales llegan siempre vía `env_file` de docker-compose.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';

        // Prefijo APPOINTMENT_DB_ para no colisionar con las variables
        // DB_* de auth-service ni TRIAGE_DB_* de triage-service, ya que
        // todos comparten el mismo archivo .env en docker-compose.qa.yml.
        // Sin fallback silencioso: si falta una variable, falla explícito
        // en vez de escribir por accidente en otra base de datos.
        return {
          type: 'postgres',
          host: configService.getOrThrow<string>('APPOINTMENT_DB_HOST'),
          port: configService.get<number>('APPOINTMENT_DB_PORT', 5432),
          username: configService.getOrThrow<string>('APPOINTMENT_DB_USER'),
          password: configService.getOrThrow<string>('APPOINTMENT_DB_PASSWORD'),
          database: configService.getOrThrow<string>('APPOINTMENT_DB_NAME'),
          entities: [Appointment],
          synchronize: !isProduction, // igual que auth-service: nunca auto-sync en prod
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    AppointmentsModule,
  ],
})
export class AppModule {}
