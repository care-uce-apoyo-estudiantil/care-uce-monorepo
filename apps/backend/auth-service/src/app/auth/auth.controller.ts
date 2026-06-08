import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

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
}
