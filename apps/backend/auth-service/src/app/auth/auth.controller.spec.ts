import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      getAllUsers: jest.fn(),
      updateRole: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => jest.clearAllMocks());

  it('registers a user forwarding the provided origin header', async () => {
    const dto = { email: 'a@uce.edu.ec' } as RegisterDto;
    (authService.register as jest.Mock).mockResolvedValue({ ok: true });

    const result = await controller.register(dto, 'mobile');

    expect(authService.register).toHaveBeenCalledWith(dto, 'mobile');
    expect(result).toEqual({ ok: true });
  });

  it('defaults the origin to "unknown" when the header is missing', async () => {
    const dto = { email: 'a@uce.edu.ec' } as RegisterDto;
    (authService.register as jest.Mock).mockResolvedValue({ ok: true });

    await controller.register(dto, undefined as unknown as string);

    expect(authService.register).toHaveBeenCalledWith(dto, 'unknown');
  });

  it('logs in a user', async () => {
    const dto = { email: 'a@uce.edu.ec', password: 'x' } as LoginDto;
    (authService.login as jest.Mock).mockResolvedValue({ token: 'jwt' });

    const result = await controller.login(dto);

    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ token: 'jwt' });
  });

  it('returns all users', async () => {
    (authService.getAllUsers as jest.Mock).mockResolvedValue([{ id: '1' }]);

    const result = await controller.getAllUsers();

    expect(result).toEqual([{ id: '1' }]);
  });

  it('updates a user role', async () => {
    (authService.updateRole as jest.Mock).mockResolvedValue({ id: '1', role: 'doctor' });

    const result = await controller.updateRole('1', 'doctor');

    expect(authService.updateRole).toHaveBeenCalledWith('1', 'doctor');
    expect(result).toEqual({ id: '1', role: 'doctor' });
  });

  it('filters users to only return doctors', async () => {
    (authService.getAllUsers as jest.Mock).mockResolvedValue([
      { id: '1', role: 'doctor' },
      { id: '2', role: 'student' },
      { id: '3', role: 'doctor' },
    ]);

    const result = await controller.getDoctors();

    expect(result).toEqual([
      { id: '1', role: 'doctor' },
      { id: '3', role: 'doctor' },
    ]);
  });

  it('returns an empty array when there are no doctors', async () => {
    (authService.getAllUsers as jest.Mock).mockResolvedValue([
      { id: '2', role: 'student' },
    ]);

    const result = await controller.getDoctors();

    expect(result).toEqual([]);
  });
});
