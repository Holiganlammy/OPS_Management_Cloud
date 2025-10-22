import { Module } from '@nestjs/common';
import { AppController } from './controller/ptec_menu.controller';
import { AppService } from './service/ptec_menu.service';
import { DatabaseManagerModule } from 'src/database/database-manager.module';

@Module({
  controllers: [AppController],
  imports: [DatabaseManagerModule],
  providers: [AppService],
})
export class PTEC_Menu_Module {}
