import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  // 🔥 Escuchamos exactamente el tópico de Kafka
  @EventPattern('triage.risk.detected')
  async handleTriageRiskDetected(@Payload() message: any) {
    this.logger.warn(
      `⚠️ ALERTA DE KAFKA RECIBIDA: Riesgo ${message.riskLevel} - Estudiante ${message.studentId}`,
    );

    // Al recibir el mensaje, creamos el expediente en Mongo
    await this.appService.createTemporaryRecord(message);
  }
}
