import { Module } from '@nestjs/common';
import { AppController } from './controller/PTEC_FA.controller';
import { AppService } from './service/PTEC_FA.service';
import { DatabaseManagerModule } from 'src/database/database-manager.module';

@Module({
  controllers: [AppController],
  imports: [DatabaseManagerModule],
  providers: [AppService],
})
export class PTEC_FA_Module {}
