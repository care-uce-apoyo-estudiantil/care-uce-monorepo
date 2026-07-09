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
    // Conexión a MongoDB
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/clinical_db',
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
