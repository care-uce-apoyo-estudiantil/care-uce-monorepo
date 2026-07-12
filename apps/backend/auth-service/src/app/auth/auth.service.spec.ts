import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// bcrypt ships a native binding; jest.spyOn cannot redefine its exports,
// so the module is mocked wholesale instead.
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
const bcrypt = require('bcrypt');

type MockRepo = Partial<Record<keyof Repository<User>, jest.Mock>>;

const createMockRepo = (): MockRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: MockRepo;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  const baseUser: User = {
    id: 'user-1',
    email: 'student@uce.edu.ec',
    password_hash: 'hashed-password',
    role: 'student',
    nombre: 'Ana Pérez',
    cedula: '1712345678',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    userRepository = createMockRepo();
    jwtService = { sign: jest.fn().mockReturnValue('signed-jwt-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      fullName: 'Ana Pérez',
      idCard: '1712345678',
      email: 'student@uce.edu.ec',
      password: 'Password1!',
      confirmPassword: 'Password1!',
    };

    it('throws ConflictException when the email is already registered', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(baseUser);

      await expect(service.register(registerDto, 'mobile')).rejects.toThrow(
        ConflictException,
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
    });

    it('throws ConflictException when the cedula is already registered', async () => {
      (userRepository.findOne as jest.Mock)
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(baseUser); // cedula check

      await expect(service.register(registerDto, 'mobile')).rejects.toThrow(
        ConflictException,
      );
    });

    it('assigns the "doctor" role when origin is desktop', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockImplementation((u) => u);
      (userRepository.save as jest.Mock).mockImplementation((u) =>
        Promise.resolve({ ...baseUser, ...u, role: u.role }),
      );

      const result = await service.register(registerDto, 'desktop');

      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'doctor' }),
      );
      expect(result.user.role).toBe('doctor');
      expect(result.access_token).toBe('signed-jwt-token');
    });

    it('assigns the "auditor" role when origin is web', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockImplementation((u) => u);
      (userRepository.save as jest.Mock).mockImplementation((u) =>
        Promise.resolve({ ...baseUser, ...u }),
      );

      const result = await service.register(registerDto, 'web');

      expect(result.user.role).toBe('auditor');
    });

    it('defaults to the "student" role for unknown origins and hashes the password', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockImplementation((u) => u);
      (userRepository.save as jest.Mock).mockImplementation((u) =>
        Promise.resolve({ ...baseUser, ...u }),
      );
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed-password');

      const result = await service.register(registerDto, 'unknown');

      expect(result.user.role).toBe('student');
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('skips the cedula check when idCard is not provided', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(null);
      (userRepository.create as jest.Mock).mockImplementation((u) => u);
      (userRepository.save as jest.Mock).mockImplementation((u) =>
        Promise.resolve({ ...baseUser, ...u, cedula: undefined }),
      );

      const dtoWithoutCedula = { ...registerDto, idCard: '' } as RegisterDto;
      await service.register(dtoWithoutCedula, 'mobile');

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'student@uce.edu.ec',
      password: 'Password1!',
    };

    it('throws UnauthorizedException when the user does not exist', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when the password is invalid', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(baseUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('returns an access token and user data on successful login', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(baseUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.login(loginDto);

      expect(result.access_token).toBe('signed-jwt-token');
      expect(result.user.email).toBe(baseUser.email);
    });

    it('falls back to default nombre/cedula when missing', async () => {
      const userWithoutExtras = { ...baseUser, nombre: '', cedula: '' };
      (userRepository.findOne as jest.Mock).mockResolvedValue(
        userWithoutExtras,
      );
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.login(loginDto);

      expect(result.user.nombre).toBe('Usuario');
      expect(result.user.cedula).toBe('0000000000');
    });
  });

  describe('getAllUsers', () => {
    it('returns the list of users ordered by creation date', async () => {
      (userRepository.find as jest.Mock).mockResolvedValue([baseUser]);

      const result = await service.getAllUsers();

      expect(result).toEqual([baseUser]);
      expect(userRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { createdAt: 'DESC' } }),
      );
    });
  });

  describe('updateRole', () => {
    it('throws UnauthorizedException when the user is not found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.updateRole('missing-id', 'doctor')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('updates the role and strips the password hash from the response', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue({
        ...baseUser,
      });
      (userRepository.save as jest.Mock).mockImplementation((u) =>
        Promise.resolve(u),
      );

      const result = await service.updateRole(baseUser.id, 'doctor');

      expect(result).not.toHaveProperty('password_hash');
      expect((result as User).role).toBe('doctor');
    });
  });
});
