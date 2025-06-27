import { Injectable } from '@nestjs/common';
import { databaseConfig } from '../config/database.config';
import * as sql from 'mssql';
import {
  SmartBill_CarInfoSearchInput,
  SmartBillAssociateInput,
  SmartBillHeaderInput,
  SmartBillOperationInput,
} from '../dto/SmartBill.dto';
import { DatabaseManagerService } from 'src/database/database-manager.service';

@Injectable()
export class SmartBillService {
  constructor(private readonly dbManager: DatabaseManagerService) {}

  async SmartBill_CreateForms(req: SmartBillHeaderInput) {
    const params = [
      { name: 'sb_code', type: sql.NVarChar(50), value: req.sb_code ?? '' },
      { name: 'usercode', type: sql.NVarChar(50), value: req.usercode },
      { name: 'sb_name', type: sql.NVarChar(100), value: req.sb_name },
      { name: 'sb_fristName', type: sql.NVarChar(50), value: req.sb_fristName },
      { name: 'sb_lastName', type: sql.NVarChar(50), value: req.sb_lastName },
      { name: 'clean_status', type: sql.Int(), value: req.clean_status },
      { name: 'group_status', type: sql.Int(), value: req.group_status },
      { name: 'reamarks', type: sql.NVarChar(200), value: req.reamarks },
      { name: 'car_infocode', type: sql.NVarChar(50), value: req.car_infocode },
      {
        name: 'car_infostatus_companny',
        type: sql.Bit(),
        value:
          req.car_infostatus_companny === '' || !req.car_infostatus_companny
            ? 0
            : req.car_infostatus_companny,
      },
      { name: 'car_categaryid', type: sql.Int(), value: req.car_categaryid },
      { name: 'car_typeid', type: sql.Int(), value: req.car_typeid },
      { name: 'car_band', type: sql.NVarChar(100), value: req.car_band },
      { name: 'car_tier', type: sql.NVarChar(50), value: req.car_tier },
      { name: 'car_color', type: sql.NVarChar(50), value: req.car_color },
      { name: 'car_remarks', type: sql.NVarChar(200), value: req.car_remarks },
    ];

    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.SmartBill_CreateForms`,
      params,
    );
  }

  async SmartBill_CreateOperation(
    data: SmartBillOperationInput,
    sb_code: string,
  ) {
    const params = [
      { name: 'sb_code', type: sql.NVarChar(50), value: sb_code },
      {
        name: 'sb_operationid_startdate',
        type: sql.NVarChar(20),
        value: data.sb_operationid_startdate,
      },
      {
        name: 'sb_operationid_startmile',
        type: sql.Int(),
        value: data.sb_operationid_startmile,
      },
      {
        name: 'sb_operationid_startoil',
        type: sql.Int(),
        value: data.sb_operationid_startoil,
      },
      {
        name: 'sb_operationid_enddate',
        type: sql.NVarChar(20),
        value: data.sb_operationid_enddate,
      },
      {
        name: 'sb_operationid_endoil',
        type: sql.Int(),
        value: data.sb_operationid_endoil,
      },
      {
        name: 'sb_operationid_endmile',
        type: sql.Int(),
        value: data.sb_operationid_endmile,
      },
      {
        name: 'sb_paystatus',
        type: sql.Int(),
        value: data.sb_paystatus,
      },
      {
        name: 'sb_operationid_location',
        type: sql.NVarChar(100),
        value: data.sb_operationid_location,
      },
    ];

    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.SmartBill_CreateOperation`,
      params,
    );
  }

  async SmartBill_CreateAssociate(
    body: SmartBillAssociateInput,
    sb_code: string,
  ) {
    const params = [
      { name: 'sb_code', type: sql.NVarChar(50), value: sb_code },
      {
        name: 'allowance_usercode',
        type: sql.NVarChar(50),
        value: body.allowance_usercode,
      },
      {
        name: 'sb_associate_startdate',
        type: sql.NVarChar(20),
        value: body.sb_associate_startdate,
      },
      {
        name: 'sb_associate_enddate',
        type: sql.NVarChar(20),
        value: body.sb_associate_enddate,
      },
    ];

    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.SmartBill_CreateAssociate`,
      params,
    );
  }

  async SmartBill_CarInfoSearch(body: SmartBill_CarInfoSearchInput) {
    const params = [
      {
        name: 'car_infocode',
        type: sql.NVarChar(50),
        value: body.car_infocode,
      },
    ];

    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.SmartBill_CarInfoSearch`,
      params,
    );
  }
}
