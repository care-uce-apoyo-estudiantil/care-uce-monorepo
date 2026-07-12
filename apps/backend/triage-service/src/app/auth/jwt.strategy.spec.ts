import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('is defined when JWT_SECRET is configured', () => {
    const configService = {
      get: jest.fn().mockReturnValue('configured-secret'),
    } as unknown as ConfigService;

    const strategy = new JwtStrategy(configService);
    expect(strategy).toBeDefined();
  });

  it('maps the JWT payload onto the request user object', async () => {
    const configService = {
      get: jest.fn().mockReturnValue('configured-secret'),
    } as unknown as ConfigService;
    const strategy = new JwtStrategy(configService);

    const result = await strategy.validate({
      sub: 'user-1',
      email: 'psychologist@uce.edu.ec',
      role: 'doctor',
    });

    expect(result).toEqual({
      userId: 'user-1',
      email: 'psychologist@uce.edu.ec',
      role: 'doctor',
    });
  });
});
