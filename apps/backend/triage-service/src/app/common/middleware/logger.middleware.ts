import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // Instanciamos el Logger nativo de NestJS con el contexto 'HTTP'
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    // Escuchamos el evento 'finish' para capturar el statusCode después de procesar la ruta
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length') || 0;

      // Imprimimos el log en consola
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next(); // Importante: pasar el control al siguiente middleware/controlador
  }
}
