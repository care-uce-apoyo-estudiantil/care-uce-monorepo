import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    pass: string,
    role: string = 'student',
  ): Promise<any> {
    // 1. Verificamos si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('El usuario ya existe en CareUCE');
    }

    // 2. Encriptamos la contraseña (10 rondas de salting)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltRounds);

    // 3. Creamos el objeto usuario
    const newUser = this.userRepository.create({
      email,
      password_hash: hashedPassword,
      role,
    });

    // 4. Lo guardamos en PostgreSQL
    const savedUser = await this.userRepository.save(newUser);

    // 5. Retornamos el usuario (¡pero nunca la contraseña!)
    const { password_hash, ...result } = savedUser;
    return result;
  }

  async login(email: string, pass: string): Promise<any> {
    // 1. Buscamos al usuario por su email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Comparamos la contraseña enviada con el hash de la BD
    const isPasswordValid = await bcrypt.compare(pass, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Creamos el "Payload" (los datos públicos que viajarán en el token)
    const payload = { sub: user.id, email: user.email, role: user.role };

    // 4. Firmamos y retornamos el JWT junto con los datos básicos
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
