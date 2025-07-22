import {
  IsNotEmpty,
  // IsBoolean,
  IsNumber,
  IsOptional,
  // IsString,
  // IsOptional,
} from 'class-validator';

export class ReservationGet_Car_ID {
  @IsNumber()
  @IsNotEmpty()
  car_id: number;
}

export class ReservationCreateBookingDto {
  @IsNumber()
  @IsNotEmpty()
  UserID: number;

  @IsNumber()
  @IsNotEmpty()
  car_infoid: number;

  @IsNumber()
  @IsNotEmpty()
  meeting_room_id: number;

  @IsNotEmpty()
  start_time: Date;

  @IsNotEmpty()
  reservation_detail: string;

  @IsOptional()
  @IsNotEmpty()
  reason_name: string;

  @IsNotEmpty()
  destination: string;

  @IsNotEmpty()
  reservation_date_start: string;

  @IsNotEmpty()
  reservation_date_end: string;
}
