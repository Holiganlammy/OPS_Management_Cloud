import { Module } from '@nestjs/common';
import { AppController } from './controller/ptec_useright.controller';
import { AppService } from './service/ptec_useright.service';
// import { User } from './domain/model/ptec_useright.model';

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
