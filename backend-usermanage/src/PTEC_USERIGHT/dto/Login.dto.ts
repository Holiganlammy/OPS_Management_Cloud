import { IsString, IsNotEmpty } from 'class-validator'; // ใช้ class-validator เพื่อตรวจสอบความถูกต้องของข้อมูล

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  loginname: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}