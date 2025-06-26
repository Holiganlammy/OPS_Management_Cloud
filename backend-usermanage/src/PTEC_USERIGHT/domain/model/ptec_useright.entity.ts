export interface User {
  //entity ใช้กับ database
  UserID: number;
  UserCode: string;
  Fullname: string;
  BranchID: number;
  DepID: number;
  Email: string;
  SecCode: string;
  DepCode: string;
  UserType: string;
  img_profile: string;
  fristName: string;
  lastName: string;
  Tel: number;
  Actived: boolean;
  Position: string;
  PositionCode: string;
  PositionID: string;
  EmpUpper: string;
  EmpUpperID: number;
  password: number;
}

export interface Branch {
  branchid: number;
  name: string;
}

export interface Department {
  depid: number;
  branchid: number;
  depname: string;
  depcode: string;
  name: string;
}

export interface Section {
  secid: number;
  depid: number;
  seccode: string;
  name: string;
  codename: string;
}

export interface Position {
  positionid: number;
  position: string;
}
