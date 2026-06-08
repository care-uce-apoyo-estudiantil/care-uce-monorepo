import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    // Recibimos los datos del cliente y los enviamos al servicio
    return this.authService.register(body.email, body.password, body.role);
  }
}
