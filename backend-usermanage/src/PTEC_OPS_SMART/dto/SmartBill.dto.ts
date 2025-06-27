import { IsString, IsNotEmpty } from 'class-validator'; // ใช้ class-validator เพื่อตรวจสอบความถูกต้องของข้อมูล

export class SmartBillHeaderInput {
  @IsString()
  @IsNotEmpty()
  sb_code: string;

  @IsString()
  @IsNotEmpty()
  usercode: string;

  @IsString()
  @IsNotEmpty()
  sb_name: string;

  @IsString()
  @IsNotEmpty()
  sb_fristName: string;

  @IsString()
  @IsNotEmpty()
  sb_lastName: string;

  @IsNotEmpty()
  clean_status: boolean | number;

  @IsNotEmpty()
  group_status: boolean | number;

  @IsString()
  @IsNotEmpty()
  reamarks: string;

  @IsString()
  @IsNotEmpty()
  car_infocode: string;

  @IsNotEmpty()
  car_infostatus_companny: boolean | number | string;

  @IsNotEmpty()
  car_categaryid: boolean | number;

  @IsNotEmpty()
  car_typeid: boolean | number;

  @IsString()
  @IsNotEmpty()
  car_band: string;

  @IsString()
  @IsNotEmpty()
  car_tier: string;

  @IsString()
  @IsNotEmpty()
  car_color: string;

  @IsString()
  @IsNotEmpty()
  car_remarks: string;
}

export class SmartBillOperationInput {
  @IsString()
  @IsNotEmpty()
  sb_code: string;

  @IsString()
  @IsNotEmpty()
  sb_operationid_startdate: string;

  @IsNotEmpty()
  sb_operationid_startmile: number;

  @IsNotEmpty()
  sb_operationid_startoil: number;

  @IsString()
  @IsNotEmpty()
  sb_operationid_enddate: string;

  @IsNotEmpty()
  sb_operationid_endoil: number;

  @IsNotEmpty()
  sb_operationid_endmile: number;

  @IsNotEmpty()
  sb_paystatus: number;

  @IsString()
  @IsNotEmpty()
  sb_operationid_location: string;
}

export class SmartBillAssociateInput {
  @IsString()
  @IsNotEmpty()
  sb_code: string;

  @IsString()
  @IsNotEmpty()
  allowance_usercode: string;

  @IsString()
  @IsNotEmpty()
  sb_associate_startdate: string;

  @IsString()
  @IsNotEmpty()
  sb_associate_enddate: string;
}

export class SmartBill_CarInfoSearchInput {
  @IsString()
  @IsNotEmpty()
  car_infocode: string;
}
