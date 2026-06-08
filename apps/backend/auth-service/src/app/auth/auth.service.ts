import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
}
