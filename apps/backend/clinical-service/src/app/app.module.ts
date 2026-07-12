import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ClinicalRecord,
  ClinicalRecordSchema,
} from './schemas/clinical-record.schema';

@Module({
  imports: [
    // 🔥 FIX: sin estas opciones, NestJS reintenta conectar solo 9 veces
    // (retryAttempts por defecto) y luego lanza la excepción SIN capturarla,
    // matando el proceso completo (visible como crash-loop en `docker ps`).
    // Con retryAttempts muy alto + retryDelay, el servicio queda esperando
    // indefinidamente a Mongo en vez de morir, y conecta solo apenas Mongo
    // esté disponible, sin necesitar reinicio manual del contenedor.
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/clinical_db',
      {
        retryAttempts: Number.MAX_SAFE_INTEGER,
        retryDelay: 5000,
        connectTimeoutMS: 10000,
      },
    ),
    // Registramos nuestro esquema
    MongooseModule.forFeature([
      { name: ClinicalRecord.name, schema: ClinicalRecordSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
