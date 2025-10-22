// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../PTEC_USERIGHT/config/jwt.config';
import { JwtPayload } from 'src/PTEC_USERIGHT/domain/model/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  validate(payload: JwtPayload) {
    if (!payload || (!payload.sub && !payload.userId)) {
      return null;
    }
    return {
      userId: payload.userId || payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
