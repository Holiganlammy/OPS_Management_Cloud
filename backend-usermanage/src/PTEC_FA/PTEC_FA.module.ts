import { Module } from '@nestjs/common';
import { PTEC_FA_Controller } from './controller/PTEC_FA.controller';
import { PTEC_FA_Service } from './service/PTEC_FA.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Module({
  controllers: [PTEC_FA_Controller],
  providers: [
    PTEC_FA_Service,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ]
})
export class PtecFaControllerModule {}
