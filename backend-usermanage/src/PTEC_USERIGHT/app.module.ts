import { Module } from '@nestjs/common';
import { AppController } from './controller/ptec_useright.controller';
import { AppService } from './service/ptec_useright.service';
import { jwtConstants } from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { redisProvider } from '../redis/redis.provider';
import { DatabaseManagerModule } from 'src/database/database-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    DatabaseManagerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    redisProvider,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class PTEC_USERRIGHT_Module {}
