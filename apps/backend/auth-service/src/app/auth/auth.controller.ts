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
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Headers('x-client-origin') origin: string,
  ): Promise<unknown> {
    // FIX: Changed to unknown to accept the Auto-Login JWT response
    // Fallback to 'unknown' if header is not present
    return this.authService.register(registerDto, origin || 'unknown');
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<unknown> {
    // FIX: Also accepts the JWT response
    // Pass the complete DTO to the service
    return this.authService.login(loginDto);
  }

  // 👇 NEW ENDPOINTS FOR WEB ADMIN PANEL 👇

  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @Patch('users/:id/role')
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: string,
  ): Promise<User> {
    return this.authService.updateRole(id, role);
  }

  // Updated endpoint to filter doctors dynamically by specialty query parameter
  @Get('doctors')
  async getDoctors(@Query('specialty') specialty?: string): Promise<User[]> {
    const allUsers = await this.authService.getAllUsers();
    let doctors = allUsers.filter((user) => user.role === 'doctor');

    if (specialty) {
      // Decode the URL encoded specialty and filter exactly
      const decodedSpecialty = decodeURIComponent(specialty);
      doctors = doctors.filter((doc) => doc.specialty === decodedSpecialty);
    }
    return doctors;
  }

  // New endpoint allowing doctors from the Desktop app to update their clinical specialty
  @Patch('profile/specialty')
  @HttpCode(HttpStatus.OK)
  async updateSpecialty(
    @Body() body: { email: string; specialty: string },
  ): Promise<User> {
    return this.authService.updateUserSpecialty(body.email, body.specialty);
  }
}
