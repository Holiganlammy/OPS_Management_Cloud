interface UserData {
  UserID: string
  UserCode: string
  Fullname: string
  BranchID: number
  BranchName: string
  DepID: number
  Email: string
  SecCode: string | null
  SecID: string | null
  DepCode: string
  DepName: string
  UserType: string | null
  img_profile: string | null
  fristName: string
  lastName: string
  Tel: string | null
  Actived: boolean
  Position: string
  PositionCode: string
  PositionID: number
  EmpUpper: string
  EmpUpperID: string
  password: string
  role_id: number
}

interface Session {
  exp:string
  iat:string
  user: UserSession
}

interface UserSession {
  userid: string,
  username: string,
  name: string,
  email: string,
  branchid: number,
  depid: number,
  depcode: string,
  depname: string,
  secid: number,
  seccode: string,
  secname: string,
  positionid: number,
  positioncode: string,
  positionname: string,
  img_profile: string | null, 
}