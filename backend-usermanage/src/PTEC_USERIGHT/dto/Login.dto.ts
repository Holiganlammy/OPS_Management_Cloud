import { IsString, IsNotEmpty, IsBooleanString } from 'class-validator'; // ใช้ class-validator เพื่อตรวจสอบความถูกต้องของข้อมูล

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  loginname: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  usercode: string;

  @IsString()
  @IsNotEmpty()
  otpCode: string;

  @IsBooleanString()
  @IsNotEmpty()
  trustDevice: boolean | string;
}

export class TrustDeviceDto {
  @IsString()
  @IsNotEmpty()
  userCode: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @IsString()
  @IsNotEmpty()
  ipAddress: string;
}
