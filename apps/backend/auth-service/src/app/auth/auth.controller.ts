import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    // Recibimos los datos del cliente y los enviamos al servicio
    return this.authService.register(body.email, body.password, body.role);
  }

  @HttpCode(HttpStatus.OK) // El login devuelve un 200 OK, no un 201 Created
  @Post('login')
  async login(@Body() body: any) {
    // Enviamos las credenciales al servicio
    return this.authService.login(body.email, body.password);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    // Si el usuario no envía un Token válido en los Headers, NestJS devolverá un 401 Unauthorized automáticamente.
    // Si es válido, req.user tendrá los datos desencriptados.
    return {
      message: '¡Acceso concedido a ruta protegida!',
      user: req.user,
    };
  }
}
