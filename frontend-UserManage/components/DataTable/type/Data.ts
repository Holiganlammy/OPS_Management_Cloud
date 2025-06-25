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
}

interface UserSession {
  Email: string
  UserCode: string
  ad: string
  areaid: number
  branchid: number
  changepassword: boolean
  dep: string
  depcode: string
  depid: number
  depname: string
  fristName: string | null
  id: number
  img_profile: string | null
  lastName: string | null
  loginTime: string
  loginname: string
  manager: string | null
  name: string
  password: string | number
  positioncode: string
  positionid: number
  positionname: string
  seccode: string
  secid: number
  secname: string
  userid: string
}