interface Period {
  PeriodID: number | null | undefined;
  BeginDate: Date | null | undefined;
  EndDate?: Date | null | undefined;
  BranchID?: string | string;
  Description?: string | null | undefined;
  DepCode?: string | null | undefined;
  personID?: string | null | undefined;
  Code?: string | null | undefined;
}

interface SelectTypePeriod {
  BranchID: string;
  Description: string;
  personID: string;
  DepCode: string;
  Code: string;
}

type FilterTypePeriod = {
  BranchID: string;
  Description: string;
  personID: string;
  DepCode: string;
  Code: string;
  filter: string;
};