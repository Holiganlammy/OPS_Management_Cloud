import { Module } from '@nestjs/common';
import { PTEC_USERRIGHT_Module } from './PTEC_USERIGHT/app.module';
import { PTEC_OPS_SMART_Module } from './PTEC_OPS_SMART/app.module';

@Module({
  imports: [PTEC_USERRIGHT_Module, PTEC_OPS_SMART_Module],
  // main-app.module.ts
})
export class MainAppModule {}
