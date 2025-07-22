import { Module } from '@nestjs/common';
import { PTEC_USERRIGHT_Module } from './PTEC_USERIGHT/app.module';
import { PTEC_OPS_SMART_Module } from './PTEC_OPS_SMART/app.module';
import { PTEC_MENU_Module } from './PTEC_MENU/app.module';
import { PTEC_FA_Module } from './PTEC_FA/app.module';
import { PTEC_RESERVATION_SYSTEMS_Module } from './PTEC_RESERVATION_SYSTEMS/app.module';

@Module({
  imports: [
    PTEC_USERRIGHT_Module,
    PTEC_OPS_SMART_Module,
    PTEC_MENU_Module,
    PTEC_FA_Module,
    PTEC_RESERVATION_SYSTEMS_Module,
  ],
})
export class MainAppModule {}
