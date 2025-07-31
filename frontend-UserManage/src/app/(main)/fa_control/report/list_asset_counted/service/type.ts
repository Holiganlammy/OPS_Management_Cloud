interface CountAssetRow {
  Code: string | null | undefined;
  Name: string | null | undefined;
  BranchID: number | null | undefined;
  OwnerID: string | null | undefined;
  Position: string | null | undefined;
  Date: Date | null | undefined; // or another suitable type for date handling
  EndDate_Success: Date | null | undefined;
  UserID: string | null | undefined;
  detail: string | null | undefined;
  Reference: string | null | undefined;
  comment: string | null | undefined;
  remarker: string | null | undefined;
  RoundID?: string | null | undefined; // Assuming this might be nullable or optional
  RowID: number | null | undefined;
  typeCode: string;
  ImagePath: string | null | undefined;
  ImagePath_2: string | null | undefined;
}

interface Assets_TypeGroup {
  typeGroupID: number;
  typeCode: string;
  typeName: string;
  typeMenu: number;
}

interface SelectTypeAssetRow {
  Code: string;
  Name: string;
  BranchID: string;
  OwnerID: string;
  Position: string;
  typeCode: string;
}

interface PeriodDescription {
  PeriodID: string;
  Description: string;
  BranchID: number;
  DepCode: string;
  personID: string;
}

type FilterCountAssetRow = {
  Code: string;
  Name: string;
  BranchID: string;
  OwnerID: string;
  Position: string;
  typeCode: string;
  filter: string;
};