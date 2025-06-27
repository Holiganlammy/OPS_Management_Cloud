interface FA_Control_Running_NO_Entity {
  nac_code: string;
  date_time: Date;
}

interface FAControlUpdateDetailCountedInput {
  roundid: number;
  code: string;
  status: number;
  comment?: string;
  reference?: string;
  image_1?: string;
  image_2?: string;
  userid: number;
}

interface NacCreateInput {
  nac_code: string;
  usercode: string;
  nac_type: number;
  nac_status: number;
  sum_price: number;
  des_dep_owner: string;
  des_bu_owner: string;
  des_usercode?: string;
  desFristName?: string;
  desLastName: string;
  des_date: string;
  des_remark: string;
  source_dep_owner: string;
  source_bu_owner?: string;
  source_usercode?: string;
  sourceFristName: string;
  sourceLastName: string;
  source_date: string;
  source_remark: string;
  verify_by_userid?: number;
  verify_date?: string;
  source_approve_userid?: number;
  source_approve_date?: string;
  account_aprrove_id?: number;
  account_aprrove_date?: string;
  finance_aprrove_id?: number;
  finance_aprrove_date?: string;
  real_price?: number;
  realPrice_Date?: string;
}

interface FAControlUpdateInput {
  nac_code: string;
  usercode: string;
  nacdtl_assetsCode: string;
  nac_type: number;
  nac_status: number;
}

interface store_FA_control_comment {
  nac_code: string;
  usercode: string;
  comment: string;
}

interface FAControlCreateDetailNacInput {
  usercode: string;
  nac_code: string;
  nacdtl_row: number;
  nacdtl_assetsCode: string;
  nacdtl_assetsSeria?: string;
  nacdtl_assetsName?: string;
  create_date?: string;
  OwnerCode?: string;
  nacdtl_assetsDtl?: string;
  nacdtl_bookV: number;
  nacdtl_PriceSeals: number;
  nacdtl_profit: number;
  nacdtl_image_1: string;
  nacdtl_image_2: string;
}