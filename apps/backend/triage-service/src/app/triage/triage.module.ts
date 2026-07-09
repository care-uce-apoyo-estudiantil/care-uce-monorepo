import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

// 1. Agregamos las importaciones necesarias para que funcione la seguridad
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// Importa tu estrategia (Asegúrate de que la ruta coincida con donde guardaste el archivo)
import { JwtStrategy } from '../auth/jwt.strategy';

import { TriageService } from './triage.service';
import { TriageController } from './triage.controller';
import { Triage } from './entities/triage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Triage]),

    // 2. Registramos los módulos de JWT
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'tu_secreto_super_seguro', // Usa el mismo secreto que en Auth
    }),

    // Inyectamos el cliente de Kafka
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'triage-service',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
          },
          consumer: {
            groupId: 'triage-consumer-group',
          },
        },
      },
    ]),
  ],
  controllers: [TriageController],

  // 3. 🔥 LA SOLUCIÓN AL ERROR: Declarar JwtStrategy como proveedor
  providers: [TriageService, JwtStrategy],
})
export class TriageModule {}
