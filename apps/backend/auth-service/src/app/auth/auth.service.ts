// Location: apps/backend/auth-service/src/app/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    nombre: string;
    cedula: string;
    specialty?: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user enforcing unique verification on both email and identification document (cedula).
   */
  async register(
    registerDto: RegisterDto,
    origin: string,
  ): Promise<LoginResponse> {
    const { email, password, fullName, idCard } = registerDto;

    // 1. Check if the email address is already taken
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException(
        'El correo electrónico ya se encuentra registrado en CareUCE',
      );
    }

    // 2. Check if the identification card (cedula) already exists
    if (idCard) {
      const existingCedula = await this.userRepository.findOne({
        where: { cedula: idCard },
      });
      if (existingCedula) {
        throw new ConflictException(
          'La cédula ingresada ya pertenece a un usuario registrado',
        );
      }
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let assignedRole = 'student';
    if (origin === 'desktop') assignedRole = 'doctor';
    if (origin === 'web') assignedRole = 'auditor';

    const newUser = this.userRepository.create({
      email,
      password_hash: hashedPassword,
      nombre: fullName,
      cedula: idCard,
      role: assignedRole,
    });

    const savedUser = await this.userRepository.save(newUser);

    // AUTO-LOGIN: Devolvemos el JWT de inmediato
    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        nombre: savedUser.nombre || fullName,
        cedula: savedUser.cedula || idCard,
      },
    };
  }

  /**
   * Authenticates active profiles processing strict login credentials packets.
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nombre: user.nombre || 'Usuario',
        cedula: user.cedula || '0000000000',
        // 🔥 AÑADE ESTA LÍNEA PARA QUE EL FRONTEND CONOZCA LA ESPECIALIDAD
        specialty: user.specialty,
      },
    };
  }

  /**
   * Retrieves all registered users for the Admin Web Dashboard.
   * Excludes sensitive data like password hashes.
   */
  async getAllUsers(): Promise<User[]> {
    const selectOptions: FindOptionsSelect<User> = {
      id: true,
      nombre: true,
      email: true,
      cedula: true,
      role: true,
      specialty: true,
      createdAt: true,
    };

    return await this.userRepository.find({
      select: selectOptions,
      order: { createdAt: 'DESC' }, // Newest first
    });
  }

  /**
   * Updates a user's role (Used by Administrators).
   */
  async updateRole(id: string, newRole: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User not found in the system');
    }

    user.role = newRole;
    const savedUser = await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...result } = savedUser;
    return result as User;
  }

  /**
   * Updates a doctor's clinical specialty.
   */
  async updateUserSpecialty(email: string, specialty: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Doctor profile not found in the database');
    }

    user.specialty = specialty;
    const savedUser = await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...result } = savedUser;
    return result as User;
  }
}
