import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// Define expected interface to avoid 'any' in Express requests
interface RequestWithUser extends Request {
  user: { userId: string; email: string; role: string };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Headers('x-client-origin') clientOrigin: string,
  ) {
    // Determine the origin safely, default to mobile if not sent
    const origin = clientOrigin ? clientOrigin.toLowerCase() : 'mobile';
    return this.authService.register(registerDto, origin);
  }

  @HttpCode(HttpStatus.OK) // Login should return 200 OK
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return {
      message: 'Access granted to protected route!',
      user: req.user,
    };
  }
}
