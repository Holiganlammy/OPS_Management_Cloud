import {IsInt , IsString, IsNotEmpty ,IsOptional ,MaxLength ,IsDateString ,IsNumber } from 'class-validator';

export class FA_Control_Running_NO_Dto {
  @IsString()
  @IsNotEmpty()
  files: string;
}

export class FA_Control_UpdateDetailCounted_Dto {
  @IsInt()
  @IsNotEmpty()
  roundid: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsInt()
  @IsNotEmpty()
  status: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  image_1?: string;

  @IsString()
  @IsOptional()
  image_2?: string;

  @IsInt()
  @IsNotEmpty()
  userid: number;
}

export class NacCreateDto {
  @IsString()
  @MaxLength(20)
  nac_code: string;

  @IsString()
  @MaxLength(30)
  usercode: string;

  @IsInt()
  nac_type: number;

  @IsInt()
  nac_status: number;

  @IsNumber()
  sum_price: number;

  @IsString()
  @MaxLength(50)
  des_dep_owner: string;

  @IsString()
  @MaxLength(50)
  des_bu_owner: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  des_usercode?: string;

  @IsOptional()
  @IsString()
  desFristName?: string;

  @IsString()
  desLastName: string;

  @IsDateString()
  des_date: string;

  @IsString()
  @MaxLength(1024)
  des_remark: string;

  @IsString()
  @MaxLength(50)
  source_dep_owner: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  source_bu_owner?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  source_usercode?: string;

  @IsString()
  sourceFristName: string;

  @IsString()
  sourceLastName: string;

  @IsDateString()
  source_date: string;

  @IsString()
  @MaxLength(1024)
  source_remark: string;

  @IsOptional()
  @IsInt()
  verify_by_userid?: number;

  @IsOptional()
  @IsDateString()
  verify_date?: string;

  @IsOptional()
  @IsInt()
  source_approve_userid?: number;

  @IsOptional()
  @IsDateString()
  source_approve_date?: string;

  @IsOptional()
  @IsInt()
  account_aprrove_id?: number;

  @IsOptional()
  @IsDateString()
  account_aprrove_date?: string;

  @IsOptional()
  @IsInt()
  finance_aprrove_id?: number;

  @IsOptional()
  @IsDateString()
  finance_aprrove_date?: string;

  @IsOptional()
  @IsNumber()
  real_price?: number;

  @IsOptional()
  @IsDateString()
  realPrice_Date?: string;
}

export class FA_control_update_Dto {
  @IsString()
  @MaxLength(30)
  nac_code: string;

  @IsString()
  @MaxLength(10)
  usercode: string;

  @IsString()
  @MaxLength(50)
  nacdtl_assetsCode: string;

  @IsInt()
  nac_type: number;

  @IsInt()
  nac_status: number;
}

export class store_FA_control_comment {
  @IsString()
  @IsNotEmpty()
  nac_code: string;

  @IsString()
  @IsNotEmpty()
  usercode: string;

  @IsInt()
  comment: string;
}


export class FA_Control_Create_Detail_NAC {
  @IsString()
  @MaxLength(20)
  usercode: string;

  @IsString()
  @MaxLength(20)
  nac_code: string;

  @IsInt()
  nacdtl_row: number;

  @IsString()
  @MaxLength(20)
  nacdtl_assetsCode: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nacdtl_assetsSeria?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  nacdtl_assetsName?: string;

  @IsOptional()
  @IsDateString()
  create_date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  OwnerCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  nacdtl_assetsDtl?: string;

  @IsNumber()
  nacdtl_bookV: number;

  @IsNumber()
  nacdtl_PriceSeals: number;

  @IsNumber()
  nacdtl_profit: number;

  @IsString()
  @MaxLength(255)
  nacdtl_image_1: string;

  @IsString()
  @MaxLength(255)
  nacdtl_image_2: string;
}
