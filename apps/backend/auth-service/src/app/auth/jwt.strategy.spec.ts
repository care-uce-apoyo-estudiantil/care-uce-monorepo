import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  const configService = {
    get: jest.fn().mockReturnValue('test-secret'),
  } as unknown as ConfigService;

  it('is defined', () => {
    const strategy = new JwtStrategy(configService);
    expect(strategy).toBeDefined();
  });

  it('maps the JWT payload onto the request user object', async () => {
    const strategy = new JwtStrategy(configService);

    const result = await strategy.validate({
      sub: 'user-1',
      email: 'user@uce.edu.ec',
      role: 'student',
    });

    expect(result).toEqual({
      userId: 'user-1',
      email: 'user@uce.edu.ec',
      role: 'student',
    });
  });
});
