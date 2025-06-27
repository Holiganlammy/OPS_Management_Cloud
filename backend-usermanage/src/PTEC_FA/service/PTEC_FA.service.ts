import { Injectable, OnModuleInit } from '@nestjs/common';
import * as sql from 'mssql';
import { databaseConfig } from '../config/database.config';
import { FA_Control_Create_Detail_NAC} from '../dto/FA_Control.dto';

@Injectable()
export class PTEC_FA_Service implements OnModuleInit {
  private pool: sql.ConnectionPool;
  private isConnected: boolean = false;

  async onModuleInit() {
    this.pool = await sql.connect(databaseConfig);
    this.isConnected = true;
  }
  private async ConnectionDB() {
    try {
      if (!this.pool) {
        this.pool = await sql.connect(databaseConfig);
        this.isConnected = true;
        console.log('Database connected successfully');
      }
    } catch (error) {
      console.error('Database connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }
  private async ensureConnection() {
    if (!this.isConnected || !this.pool) {
      await this.ConnectionDB();
    }
  }
  async FA_Control_Running_NO(){
    try {
      await this.ensureConnection();
      const result = await this.pool
        .request()
        .query(`
          declare @nac_code varchar(100)
          declare @date_time datetime = getdate()
          exec [dbo].[RunningNo] 'ATT', @date_time, @nac_code output
          select @nac_code as ATT
      `)
      //sql.close()
      return result.recordset;
    } catch (error) {
      //sql.close()
      return error.message;
    }
  }
  async FA_Control_Report_All_Counted_by_Description(Report_All_Counted_by_Description: { Description: string }) {
    try {
      await this.ensureConnection();
      const result = await this.pool
        .request()
        .input('Description', sql.NVarChar(200), Report_All_Counted_by_Description.Description)
        .query(`
          exec [dbo].[FA_Control_Report_All_Counted_by_Description]
        `);
      return result.recordset;
    } catch (error) {
      console.error('Error in FA_Control_Report_All_Counted_by_Description:', error);
      throw error;
    }
  }

  async FA_Control_NAC_Backlog() {
    try {
      await this.ensureConnection();
      const result = await this.pool
        .request()
        .execute('dbo.FA_Control_NAC_Backlog');
      return result.recordset;
    } catch (error) {
      console.error('Error in FA_Control_NAC_Backlog:', error);
      throw error;
    }
  }
  async FA_Control_AnnualGraph(TargetYear: string) {
    try {
      const result = await this.pool
        .request()
        .input('TargetYear', sql.Int, TargetYear)
        .execute('dbo.FA_Control_AnnualGraph');
      return result.recordset;
    } catch (error) {
      console.error('Error in FA_Control_AnnualGraph:', error);
      throw error;
    }
  }
  async FA_Control_Fetch_Assets(usercode: string) {
    try {
      await this.ensureConnection();
      const result = await this.pool
        .request()
        .input('usercode', sql.VarChar(10), usercode)
        .execute('dbo.FA_Control_Fetch_Assets');
      return result.recordset;
    } catch (error) {
      console.error('Error in FA_Control_Fetch_Assets:', error);
      throw error;
    }
  }
  async FA_Control_UpdateDetailCounted(body: FAControlUpdateDetailCountedInput) {
    try {
      await this.ensureConnection();
      const result = await this.pool
        .request()
        .input('roundid', sql.Int, body.roundid)
        .input('code', sql.NVarChar(20), body.code)
        .input('status', sql.Int, body.status)
        .input('comment', sql.NVarChar(255), body.comment)
        .input('reference', sql.NVarChar(100), body.reference)
        .input('image_1', sql.NVarChar, body.image_1)
        .input('image_2', sql.NVarChar, body.image_2)
        .input('userid', sql.Int, body.userid)
        .execute('dbo.FA_Control_UpdateDetailCounted');
      return result.recordset;
    } catch (error) {
      console.error('Error in FA_Control_UpdateDetailCounted:', error);
      throw error;
    }
  }
  async FA_Control_Assets_TypeGroup(){
    try {
      await this.ensureConnection();
      const result = await this.pool
        .request()
        .execute('dbo.FA_Control_Assets_TypeGroup');
      return result.recordset;
    } catch (error) {
      console.error('Error in FA_Control_Assets_TypeGroup:', error);
      throw error;
    }
  }
  async FA_Control_Create_Document_NAC(body: NacCreateInput){
    try {
      await this.ensureConnection();
      const result = await this.pool
        .request()
        .input('nac_code', sql.NVarChar(20), body.nac_code)
        .input('usercode', sql.NVarChar(30), body.usercode)
        .input('nac_type', sql.Int, body.nac_type)
        .input('nac_status', sql.Int, body.nac_status)
        .input('sum_price', sql.Decimal(18, 2), body.sum_price)
        .input('des_dep_owner', sql.NVarChar(50), body.des_dep_owner)
        .input('des_bu_owner', sql.NVarChar(50), body.des_bu_owner)
        .input('des_usercode', sql.NVarChar(10), body.des_usercode)
        .input('desFristName', sql.NVarChar(50), body.desFristName)
        .input('desLastName', sql.NVarChar(50), body.desLastName)
        .input('des_date', sql.DateTime, body.des_date)
        .input('des_remark', sql.NVarChar(1024), body.des_remark)
        .input('source_dep_owner', sql.NVarChar(50), body.source_dep_owner)
        .input('source_bu_owner', sql.NVarChar(50), body.source_bu_owner)
        .input('source_usercode', sql.NVarChar(10), body.source_usercode)
        .input('sourceFristName', sql.NVarChar(50), body.sourceFristName)
        .input('sourceLastName', sql.NVarChar(50), body.sourceLastName)
        .input('source_date', sql.DateTime, body.source_date)
        .input('source_remark', sql.NVarChar(1024), body.source_remark)
        .input('verify_by_userid', sql.Int, body.verify_by_userid)
        .input('verify_date', sql.DateTime, body.verify_date)
        .input('source_approve_userid', sql.Int, body.source_approve_userid)
        .input('source_approve_date', sql.DateTime, body.source_approve_date)
        .input('account_aprrove_id', sql.Int, body.account_aprrove_id)
        .input('account_aprrove_date', sql.DateTime, body.account_aprrove_date)
        .input('finance_aprrove_id', sql.Int, body.finance_aprrove_id)
        .input('finance_aprrove_date', sql.DateTime, body.finance_aprrove_date)
        .input('real_price', sql.Decimal(18, 2), body.real_price)
        .input('realPrice_Date', sql.DateTime, body.realPrice_Date)
        .execute('dbo.FA_ControlNew_Create_NAC');
      return result.recordset;
    } catch (error) {
      console.error('Error in FA_Control_Create_Document_NAC:', error);
      throw error;
    }
  }
  async store_FA_control_update_table (req: FAControlUpdateInput) {
    try {
      const result = await this.pool
        .request()
        .input('nac_code', sql.VarChar(30), req.nac_code)
        .input('usercode', sql.VarChar(10), req.usercode)
        .input('nacdtl_assetsCode', sql.VarChar(50), req.nacdtl_assetsCode)
        .input('nac_type', sql.Int, req.nac_type)
        .input('nac_status', sql.Int, req.nac_status)
        .execute('dbo.FA_Control_Update_Table');
      return result.recordset;
    } catch (error) {
      console.error('Error in store_FA_control_upadate_table:', error);
      throw error;
    }
  }
  async store_FA_control_comment(req: store_FA_control_comment) {
    try {
      const result = await this.pool
        .request()
        .input('nac_code', sql.VarChar(20), req.nac_code)
        .input('usercode', sql.NVarChar(20), req.usercode)
        .input('comment', sql.NVarChar(200), req.comment)
        .execute('dbo.FA_Control_Comment');
      return result.recordset;
    } catch (error) {
      console.error('Error in store_FA_control_comment:', error);
      throw error;
    }
  }
  async FA_Control_Create_Detail_NAC(req: FAControlCreateDetailNacInput) {
    try {
      const result = await this.pool
        .request()
        .input('usercode', sql.VarChar(20), req.usercode)
        .input('nac_code', sql.VarChar(20), req.nac_code)
        .input('nacdtl_row', sql.Int, req.nacdtl_row)
        .input('nacdtl_assetsCode', sql.NVarChar(20), req.nacdtl_assetsCode)
        .input('nacdtl_assetsSeria', sql.NVarChar(100), req.nacdtl_assetsSeria ?? null)
        .input('nacdtl_assetsName', sql.NVarChar(200), req.nacdtl_assetsName ?? null)
        .input('create_date', sql.DateTime, req.create_date ?? null)
        .input('OwnerCode', sql.NVarChar(20), req.OwnerCode ?? null)
        .input('nacdtl_assetsDtl', sql.NVarChar(200), req.nacdtl_assetsDtl ?? null)
        .input('nacdtl_bookV', sql.Float, req.nacdtl_bookV)
        .input('nacdtl_PriceSeals', sql.Float, req.nacdtl_PriceSeals)
        .input('nacdtl_profit', sql.Float, req.nacdtl_profit)
        .input('nacdtl_image_1', sql.NVarChar(255), req.nacdtl_image_1)
        .input('nacdtl_image_2', sql.NVarChar(255), req.nacdtl_image_2)
        .execute('dbo.FA_Control_Create_Detail_NAC');
      return result.recordset;
    } catch (error) {
      console.error('Error in FA_Control_Create_Detail_NAC:', error);
      throw error;
    }
  }
  async store_FA_SendMail(req: { nac_code: string}) {
    try {
      const result = await this.pool
        .request()
        .input('nac_code', sql.VarChar(30), req.nac_code)
        .execute('dbo.FA_Controls_NAC_SendMail');
      return result.recordset;
    } catch (error) {
      console.error('Error in store_FA_SendMail:', error);
      throw error;
    }
  }
  async AssetsAll_Control(req: { BranchID: number, usercode: string }) {
    try {
      const result = await this.pool
        .request()
        .input('BranchID', sql.Int, req.BranchID)
        .input('usercode', sql.NVarChar, req.usercode ?? null)
        .execute('dbo.FA_Mobile_AssetsAll_Control');
      return result.recordset;
    } catch (error) {
      console.error('Error in AssetsAll_Control:', error);
      throw error;
    }
  }
  
}
