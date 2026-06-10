import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(payload: any) {
    // Este payload es lo que desencripta NestJS del token.
    // Lo que retornemos aquí, NestJS lo inyectará en 'req.user'
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
