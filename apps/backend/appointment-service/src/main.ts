import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para que el móvil y el escritorio puedan hacer peticiones
  app.enableCors();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Leer el puerto de las variables de entorno, o usar 3000 por defecto
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Appointment Service is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
