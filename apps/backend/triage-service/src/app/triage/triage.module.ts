import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TriageService } from './triage.service';
import { TriageController } from './triage.controller';
import { Triage } from './entities/triage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Triage]),
    // Inyectamos el cliente de Kafka
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'triage-service',
            // En AWS usaremos la URL de MSK, en local tu contenedor de docker
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
  providers: [TriageService],
})
export class TriageModule {}
