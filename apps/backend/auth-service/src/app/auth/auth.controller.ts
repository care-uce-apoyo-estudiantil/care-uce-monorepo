// Location: apps/backend/auth-service/src/app/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Headers('x-client-origin') origin: string,
  ): Promise<unknown> {
    // Si no viene el header, le ponemos 'unknown' por defecto
    return this.authService.register(registerDto, origin || 'unknown');
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<unknown> {
    // Le pasamos el DTO completo al servicio
    return this.authService.login(loginDto);
  }

  // 👇 NUEVOS ENDPOINTS PARA EL PANEL ADMINISTRATIVO WEB 👇

  @Get('users')
  async getAllUsers(): Promise<unknown> {
    return this.authService.getAllUsers();
  }

  @Patch('users/:id/role')
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: string,
  ): Promise<unknown> {
    return this.authService.updateRole(id, role);
  }
}
