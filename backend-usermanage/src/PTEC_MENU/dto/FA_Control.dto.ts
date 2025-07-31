import { IsInt, IsNotEmpty } from 'class-validator';

export class Apps_MenuInput {
  @IsInt()
  @IsNotEmpty()
  UserID: number;
}
