import { Module } from '@nestjs/common';
import { AppController } from './controller/ptec_smart.controller';
import { AppService } from './service/ptec_smart.service';
import { DatabaseManagerModule } from 'src/database/database-manager.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [AppController],
  imports: [
    DatabaseManagerModule,
    MulterModule.register({
      dest: 'D:/files/smartBill/',
    }),
  ],
  providers: [AppService],
})
export class PTEC_OPS_SMART_Module {}
