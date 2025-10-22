import { Module } from '@nestjs/common';
import { AppController } from './controller/ptec_reservation.controller';
import { AppService } from './service/ptec.reservation.service';
import { DatabaseManagerModule } from 'src/database/database-manager.module';

@Module({
  controllers: [AppController],
  imports: [DatabaseManagerModule],
  providers: [AppService],
})
export class PTEC_RESERVATION_SYSTEMS_Module {}
