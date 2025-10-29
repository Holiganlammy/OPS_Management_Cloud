interface Asset {
    AssetID: string
    Asset_group: string
    BranchID: number 
    Code: string 
    CreateDate: string
    Details: string
    Group_name: string
    ImagePath: string
    ImagePath_2: string
    Name: string
    Old_Details: string
    Old_UpdateBy: string
    Old_UpdateDate: string
    OwnerID: string
    Position: string
    Price: number
    SerialNo: string
    UpdateBy: string
    UpdateDate: string
    bac_status: number
    nac_processing: string
    typeCode: string
}

interface ApiResponse {
  typeGroup: never[]
  find(arg0: (d: any) => boolean): unknown
  success: boolean;
  data: Asset[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  total?: number;
  page?: number;
  hasMore?: boolean;
}

interface FilterOption {
  codes?: OptionEntity[];
  names?: OptionEntity[];
  owners?: OptionEntity[];
  groups?: OptionEntity[];
  locations?: OptionEntity[];
}


interface OptionEntity {
  value: string;
  label: string;
}