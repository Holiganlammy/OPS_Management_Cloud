import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { DatabaseManagerService } from 'src/database/database-manager.service';
import { databaseConfig } from '../config/database.config';
import { Apps_MenuInput } from '../dto/FA_Control.dto';

@Injectable()
export class AppService {
  constructor(private readonly dbManager: DatabaseManagerService) {}

  async Apps_List_Menu(req: Apps_MenuInput) {
    try {
      return this.dbManager.executeStoredProcedure(
        `${databaseConfig.database}.dbo.Apps_List_Menu`,
        [{ name: 'userid', type: sql.Int(), value: req.userid }],
      );
    } catch (error) {
      console.error('Error in Apps_List_Menu:', error);
      throw error;
    }
  }
}
