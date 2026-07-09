import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
    clientOrigin: string,
  ): Promise<Omit<User, 'password_hash'>> {
    const { fullName, idCard, email, password, confirmPassword } = registerDto;

    // 1. Password confirmation check
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // 2. Check if user or ID card already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { id_card: idCard }],
    });

    if (existingUser) {
      throw new ConflictException(
        'User email or ID Card already exists in CareUCE',
      );
    }

    // 3. Determine role based on the origin of the request
    let assignedRole = 'student'; // Default for mobile
    if (clientOrigin === 'desktop') {
      assignedRole = 'health_professional';
    } else if (clientOrigin === 'web') {
      assignedRole = 'control_personnel';
    }

    // 4. Hash the password with 10 salt rounds for security
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. Create user object
    const newUser = this.userRepository.create({
      full_name: fullName,
      id_card: idCard,
      email,
      password_hash: hashedPassword,
      role: assignedRole,
      is_email_verified: email.endsWith('@uce.edu.ec'), // Auto-verify if institutional
    });

    // 6. Save to PostgreSQL
    const savedUser = await this.userRepository.save(newUser);

    // 7. Return user without the password hash
    // Fix: We intentionally extract password_hash to exclude it from the result.
    // We disable the ESLint rule for the next line because the variable is meant to be unused.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...result } = savedUser;

    return result;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: Partial<User> }> {
    const { email, password } = loginDto;

    // 1. Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare incoming password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Create the JWT payload
    const payload = { sub: user.id, email: user.email, role: user.role };

    // 4. Sign and return the JWT
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
