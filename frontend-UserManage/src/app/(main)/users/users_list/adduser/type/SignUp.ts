interface UserSignup {
  Name: string;
  loginname: string;
  branchid: string;
  department: string;
  secid: string;
  positionid: string;
  empupper: string;
  email: string;
  password: string;
}

interface UserSignup {
  UserID: number;
  UserCode: string;
  Fullname: string;
  BranchID: number;
  DepID: number;
  Email: string;
  SecCode: string | null;
  DepCode: string;
  UserType: string | null;
  img_profile: string | null;
  fristName: string;
  lastName: string;
  Tel: string | null;
  Actived: boolean;
  Position: string;
  PositionCode: string;
  PositionID: number;
  EmpUpper: string;
}

interface Branch {
    branchid: number;
    name: string;
}

interface Department {
    depid: number;
    branchid: number;
    depname: string;
    depcode: string;
    name: string;
}

interface Section {
    secid: number;
    depid: number;
    seccode: string;
    name: string;
    codename: string;
}

interface Position {
    positionid: number;
    position: string;
}