// src/auth/guards/jwt-auth.guard.ts
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../auth/decorators/public.decorator';
import { Observable } from 'rxjs';

interface JwtInfo {
  name?: string;
  message?: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // เช็คว่าเป็น public endpoint หรือไม่
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const canActivate = super.canActivate(context);

    if (canActivate instanceof Promise) {
      return canActivate.catch((err) => {
        throw err; // ให้ไปที่ handleRequest
      });
    }

    return canActivate;
  }

  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    // console.log('🔐 handleRequest ถูกเรียก');
    // console.log('Error:', err);
    // console.log('User:', user);
    // console.log('Info:', info);
    // console.log('Info name:', (info as JwtInfo)?.name);

    // ✅ ถ้ามี error หรือไม่มี user
    if (err || !user) {
      let customResponse;

      // Token หมดอายุ
      if ((info as JwtInfo)?.name === 'TokenExpiredError') {
        console.log('⏰ Token หมดอายุ');
        customResponse = {
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Token has expired. Please login again.',
          tokenExpired: true,
          timestamp: new Date().toISOString(),
        };
      }
      // Token ไม่ถูกต้อง
      else if ((info as JwtInfo)?.name === 'JsonWebTokenError') {
        console.log('❌ Token ไม่ถูกต้อง');
        customResponse = {
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid token format.',
          tokenInvalid: true,
          timestamp: new Date().toISOString(),
        };
      }
      // Token signature ไม่ถูกต้อง
      else if ((info as JwtInfo)?.name === 'NotBeforeError') {
        customResponse = {
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Token not active yet.',
          tokenNotActive: true,
          timestamp: new Date().toISOString(),
        };
      }
      // ไม่มี token หรือ error อื่นๆ
      else {
        customResponse = {
          statusCode: 401,
          error: 'Unauthorized',
          message:
            (info as JwtInfo)?.message ||
            'Authentication required. No valid token provided.',
          noToken: true,
          timestamp: new Date().toISOString(),
        };
      }

      throw new UnauthorizedException(customResponse);
    }

    return user as TUser;
  }
}
