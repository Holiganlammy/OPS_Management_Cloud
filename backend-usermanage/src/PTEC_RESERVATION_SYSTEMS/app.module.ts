import { Module } from '@nestjs/common';
import { AppController } from './controller/ptec_reservation.controller';
import { AppService } from './service/ptec.reservation.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DatabaseManagerModule } from 'src/database/database-manager.module';

@Module({
  controllers: [AppController],
  imports: [DatabaseManagerModule],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class PTEC_RESERVATION_SYSTEMS_Module {}
