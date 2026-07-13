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
    return this.authService.register(registerDto, origin || 'unknown');
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<unknown> {
    return this.authService.login(loginDto);
  }

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

  @Get('doctors')
  async getDoctors(@Query('specialty') specialty?: string): Promise<User[]> {
    const allUsers = await this.authService.getAllUsers();
    let doctors = allUsers.filter((user) => user.role === 'doctor');

    if (specialty) {
      const decodedSpecialty = decodeURIComponent(specialty);
      doctors = doctors.filter((doc) => doc.specialty === decodedSpecialty);
    }
    return doctors;
  }

  @Patch('profile/specialty')
  @HttpCode(HttpStatus.OK)
  async updateSpecialty(
    @Body() body: { email: string; specialty: string },
  ): Promise<User> {
    return this.authService.updateUserSpecialty(body.email, body.specialty);
  }

  // 🔥 NEW: Endpoint for updating student profile data
  @Patch('profile/student')
  @HttpCode(HttpStatus.OK)
  async updateStudentProfile(
    @Body() body: { email: string; birthDate: string; major: string },
  ): Promise<User> {
    return this.authService.updateStudentProfile(
      body.email,
      body.birthDate,
      body.major,
    );
  }

  // 🔥 NEW: Endpoint for updating user password
  @Patch('users/password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Body() body: { email: string; password: string },
  ): Promise<{ message: string }> {
    return this.authService.updatePassword(body.email, body.password);
  }
}
