import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { DatabaseManagerService } from 'src/database/database-manager.service';
import { databaseConfig } from '../config/database.config';

@Injectable()
export class PTEC_FA_Service  {
constructor(private readonly dbManager: DatabaseManagerService) {}

  async FA_Control_Running_NO(){
    try {
      return await this.dbManager.query(
        `declare @nac_code varchar(100)
         declare @date_time datetime = getdate()
         exec [${databaseConfig.database}].[dbo].[RunningNo] 'ATT', @date_time, @nac_code output
         select @nac_code as ATT`
      );
    } catch (error) {
      return error.message;
    }
  }
  async FA_Control_Report_All_Counted_by_Description(Report_All_Counted_by_Description: { Description: string }) {
    try {
      return this.dbManager.executeStoredProcedure(
        `${databaseConfig.database}.dbo.FA_Control_Report_All_Counted_by_Description`,
        [{ name: 'Description', type: sql.NVarChar(200), value: Report_All_Counted_by_Description.Description }]
      );
    } catch (error) {
      console.error('Error in FA_Control_Report_All_Counted_by_Description:', error);
      throw error;
    }
  }

  async FA_Control_NAC_Backlog() {
    try {
      return await this.dbManager.executeStoredProcedure(
        `${databaseConfig.database}.dbo.FA_Control_NAC_Backlog`,
        []
      );
    } catch (error) {
      console.error('Error in FA_Control_NAC_Backlog:', error);
      throw error;
    }
  }
  async FA_Control_AnnualGraph(TargetYear: string) {
    try {
      return await this.dbManager.executeStoredProcedure(
        `${databaseConfig.database}.dbo.FA_Control_AnnualGraph`,
        [{ name: 'TargetYear', type: sql.Int(), value: TargetYear }]
      );
    } catch (error) {
      console.error('Error in FA_Control_AnnualGraph:', error);
      throw error;
    }
  }
  async FA_Control_Fetch_Assets(usercode: string) {
    try {
      return await this.dbManager.executeStoredProcedure(
        `${databaseConfig.database}.dbo.FA_Control_Fetch_Assets`,
        [{ name: 'usercode', type: sql.VarChar(10), value: usercode }]
      );
    } catch (error) {
      console.error('Error in FA_Control_Fetch_Assets:', error);
      throw error;
    }
  }
  async FA_Control_UpdateDetailCounted(body: FAControlUpdateDetailCountedInput) {
    try {
      return await this.dbManager.executeStoredProcedure(
        `${databaseConfig.database}.dbo.FA_Control_UpdateDetailCounted`,
        [
          { name: 'roundid', type: sql.Int(), value: body.roundid },
          { name: 'code', type: sql.NVarChar(20), value: body.code },
          { name: 'status', type: sql.Int(), value: body.status },
          { name: 'comment', type: sql.NVarChar(255), value: body.comment },
          { name: 'reference', type: sql.NVarChar(100), value: body.reference },
          { name: 'image_1', type: sql.NVarChar(), value: body.image_1 },
          { name: 'image_2', type: sql.NVarChar(), value: body.image_2 },
          { name: 'userid', type: sql.Int(), value: body.userid },
        ]
      );
    } catch (error) {
      console.error('Error in FA_Control_UpdateDetailCounted:', error);
      throw error;
    }
  }
  async FA_Control_Assets_TypeGroup(){
    try {
      return await this.dbManager.executeStoredProcedure(
        `${databaseConfig.database}.dbo.FA_Control_Assets_TypeGroup`,
        []
      );
    } catch (error) {
      console.error('Error in FA_Control_Assets_TypeGroup:', error);
      throw error;
    }
  }
  async FA_Control_Create_Document_NAC(body: NacCreateInput){
    try {
      return await this.dbManager.executeStoredProcedure(
        `${databaseConfig.database}.dbo.FA_Control_Create_Document_NAC`,
        [
          { name: 'nac_code', type: sql.NVarChar(20), value: body.nac_code },
          { name: 'usercode', type: sql.NVarChar(30), value: body.usercode },
          { name: 'nac_type', type: sql.Int(), value: body.nac_type },
          { name: 'nac_status', type: sql.Int(), value: body.nac_status },
          { name: 'sum_price', type: sql.Decimal(18, 2), value: body.sum_price },
          { name: 'des_dep_owner', type: sql.NVarChar(50), value: body.des_dep_owner },
          { name: 'des_bu_owner', type: sql.NVarChar(50), value: body.des_bu_owner },
          { name: 'des_usercode', type: sql.NVarChar(10), value: body.des_usercode },
          { name: 'desFristName', type: sql.NVarChar(50), value: body.desFristName },
          { name: 'desLastName', type: sql.NVarChar(50), value: body.desLastName },
          { name: 'des_date', type: sql.DateTime(), value: body.des_date },
          { name: 'des_remark', type: sql.NVarChar(1024), value: body.des_remark },
          { name: 'source_dep_owner', type: sql.NVarChar(50), value: body.source_dep_owner },
          { name: 'source_bu_owner', type: sql.NVarChar(50), value: body.source_bu_owner },
          { name: 'source_usercode', type: sql.NVarChar(10), value: body.source_usercode },
          { name: 'sourceFristName', type: sql.NVarChar(50), value: body.sourceFristName },
          { name: 'sourceLastName', type: sql.NVarChar(50), value: body.sourceLastName },
          { name: 'source_date', type: sql.DateTime(), value: body.source_date },
          { name: 'source_remark', type: sql.NVarChar(1024), value: body.source_remark },
          { name: 'verify_by_userid', type: sql.Int(), value: body.verify_by_userid ?? null },
          { name: 'verify_date', type: sql.DateTime(), value: body.verify_date ?? null },
          { name: 'source_approve_userid', type: sql.Int(), value: body.source_approve_userid ?? null },
          { name: 'source_approve_date', type: sql.DateTime(), value: body.source_approve_date ?? null },
          { name: 'account_aprrove_id', type: sql.Int(), value: body.account_aprrove_id ?? null },
          { name: 'account_aprrove_date', type: sql.DateTime(), value: body.account_aprrove_date ?? null },
          { name: 'finance_aprrove_id', type: sql.Int(), value: body.finance_aprrove_id ?? null },
          { name: 'finance_aprrove_date', type: sql.DateTime(), value: body.finance_aprrove_date ?? null },
          { name: 'real_price', type: sql.Decimal(18, 2), value: body.real_price ?? null },
          { name: 'realPrice_Date', type: sql.DateTime(), value: body.realPrice_Date ?? null },
        ]
      );
    } catch (error) {
      console.error('Error in FA_Control_Create_Document_NAC:', error);
      throw error;
    }
  }
  async store_FA_control_update_table (req: FAControlUpdateInput) {
    try {
      return await this.dbManager.executeStoredProcedure(
        `${databaseConfig.database}.dbo.FA_Control_Update_Table`,
        [
          { name: 'nac_code', type: sql.VarChar(30), value: req.nac_code },
          { name: 'usercode', type: sql.VarChar(10), value: req.usercode },
          { name: 'nacdtl_assetsCode', type: sql.VarChar(50), value: req.nacdtl_assetsCode },
          { name: 'nac_type', type: sql.Int(), value: req.nac_type },
          { name: 'nac_status', type: sql.Int(), value: req.nac_status },
        ]
      );
    } catch (error) {
      console.error('Error in store_FA_control_upadate_table:', error);
      throw error;
    }
  }
  async store_FA_control_comment(req: store_FA_control_comment) {
    try {
      return await this.dbManager.executeStoredProcedure(
        `${databaseConfig.database}.dbo.FA_Control_Comment`,
        [
          { name: 'nac_code', type: sql.VarChar(20), value: req.nac_code },
          { name: 'usercode', type: sql.NVarChar(20), value: req.usercode },
          { name: 'comment', type: sql.NVarChar(200), value: req.comment }
        ]
      );
    } catch (error) {
      console.error('Error in store_FA_control_comment:', error);
      throw error;
    }
  }
  async FA_Control_Create_Detail_NAC(req: FAControlCreateDetailNacInput) {
    try {
      return await this.dbManager.executeStoredProcedure(
        `${databaseConfig.database}.dbo.FA_Control_Create_Detail_NAC`,
        [
          { name: 'usercode', type: sql.VarChar(20), value: req.usercode },
          { name: 'nac_code', type: sql.VarChar(20), value: req.nac_code },
          { name: 'nacdtl_row', type: sql.Int(), value: req.nacdtl_row },
          { name: 'nacdtl_assetsCode', type: sql.NVarChar(20), value: req.nacdtl_assetsCode },
          { name: 'nacdtl_assetsSeria', type: sql.NVarChar(100), value: req.nacdtl_assetsSeria ?? null },
          { name: 'nacdtl_assetsName', type: sql.NVarChar(200), value: req.nacdtl_assetsName ?? null },
          { name: 'create_date', type: sql.DateTime(), value: req.create_date ?? null },
          { name: 'OwnerCode', type: sql.NVarChar(20), value: req.OwnerCode ?? null },
          { name: 'nacdtl_assetsDtl', type: sql.NVarChar(200), value: req.nacdtl_assetsDtl ?? null },
          { name: 'nacdtl_bookV', type: sql.Float(), value: req.nacdtl_bookV },
          { name: 'nacdtl_PriceSeals', type: sql.Float(), value: req.nacdtl_PriceSeals },
          { name: 'nacdtl_profit', type: sql.Float(), value: req.nacdtl_profit },
          { name: 'nacdtl_image_1', type: sql.NVarChar(255), value: req.nacdtl_image_1 },
          { name: 'nacdtl_image_2', type: sql.NVarChar(255), value: req.nacdtl_image_2 }
        ]
      );
    } catch (error) {
      console.error('Error in FA_Control_Create_Detail_NAC:', error);
      throw error;
    }
  }
  async store_FA_SendMail(req: { nac_code: string}) {
    try {
      return await this.dbManager.executeStoredProcedure(
        `${databaseConfig.database}.dbo.FA_Controls_NAC_SendMail`,
        [{ name: 'nac_code', type: sql.VarChar(30), value: req.nac_code }]
      );
    } catch (error) {
      console.error('Error in store_FA_SendMail:', error);
      throw error;
    }
  }
  async AssetsAll_Control(req: { BranchID: number, usercode: string }) {
    try {
      return await this.dbManager.executeStoredProcedure(
        `${databaseConfig.database}.dbo.FA_Mobile_AssetsAll_Control`,
        [
          { name: 'BranchID', type: sql.Int(), value: req.BranchID },
          { name: 'usercode', type: sql.NVarChar(), value: req.usercode ?? null }
        ]
      );
    } catch (error) {
      console.error('Error in AssetsAll_Control:', error);
      throw error;
    }
  }
  
}
