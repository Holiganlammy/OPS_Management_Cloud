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
  role_id: number;
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

export interface ForgetPasswordModel {
  result: number;
  message: string;
  user_id: number;
  fullname: string;
}

export interface CreateUserResult {
  status: 'success' | 'duplicate' | 'error';
  message?: string;
  [key: string]: any; // สำหรับข้อมูล user อื่นๆ ที่อาจส่งกลับมา
}

export interface CheckUserPermission {
  HasPermission: number;
  RoleID: number;
  RoleName: string;
  Message: string;
  SystemCode: string;
}

export interface UserWithRoles {
  UserID: number;
  UserCode: string;
  FristName: string;
  LastName: string;
  Email: string;
  ImgProfile: string;
  RoleID: number;
  BranchID: number;
  DepID: number;
  RoleName: string;
  BranchName: string;
  DepartmentName: string;
  Actived: number;
  PasswordExpire: Date;
}
