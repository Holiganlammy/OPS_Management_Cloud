interface List_NAC {
  nac_code: string | null | undefined;
  nac_status: number | null | undefined;
  status_name: string | null | undefined;
  sum_price: number | null | undefined;
  name: string | null | undefined;
  workflowtypeid: number | null | undefined;
  create_date: Date | null | undefined;
  verify_by_userid: string | null | undefined;
  source_approve_userid: string | null | undefined;
  create_by: string | null | undefined;
  source_userid: string | null | undefined;
  des_userid: string | null | undefined;
  userid_approver: string | null | undefined;
  TypeCode: string | null | undefined;
}

interface Assets_TypeGroup {
  typeGroupID: number;
  typeCode: string;
  typeName: string;
  typeMenu: number;
}

interface SelectTypeNAC {
  nac_code: string;
  name: string;
  source_userid: string;
  des_userid: string;
  status_name: string;
}

type FilterTypeNac = {
  nac_code: string;
  name: string;
  source_userid: string;
  des_userid: string;
  status_name: string;
  filter: string;
};