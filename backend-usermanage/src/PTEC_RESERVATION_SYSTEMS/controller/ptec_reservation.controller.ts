import {
  Controller,
  HttpException,
  HttpStatus,
  Query,
  Get,
  Res,
  Body,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from '../service/ptec.reservation.service';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  ReservationCreateBookingDto,
  ReservationGet_Car_ID,
} from '../dto/Reservation_Car.dto';
// import { ReservationGet_Car_ID } from '../dto/Reservation_Car.dto';

@Controller('reservation')
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('/reservation_get_list')
  async Reservation_GetById(@Res() res: Response) {
    try {
      const result = await this.service.Reservation_cars_Get();
      if (result.length == 0) {
        return {
          message: 'ไม่พบข้อมูล',
          code: 400,
        };
      } else {
        res.status(200).send(result);
      }
    } catch (error: unknown) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Unknown error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/reservation_meeting_rooms_list')
  async Reservation_Meeting_Rooms_Get(@Res() res: Response) {
    try {
      const result = await this.service.Reservation_Meeting_Rooms_Get();
      if (result.length == 0) {
        return res.status(400).send({ message: 'ไม่พบข้อมูลห้องประชุม' });
      } else {
        return res.status(200).send(result);
      }
    } catch (error: unknown) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Unknown error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Get('/reservation_car_detail')
  async Reservation_cars_detail(
    @Query('id') id: ReservationGet_Car_ID,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      if (!id) {
        return res.status(400).send({ message: 'Missing car ID in query' });
      }
      const result = await this.service.Reservation_Car_GetById({ car_id: id });
      return res.status(200).send(result);
    } catch (error: unknown) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Unknown error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/reservation_create_booking')
  async Reservation_Create_Booking(
    @Body() req: ReservationCreateBookingDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      if (!req || !req.car_infoid) {
        return res.status(400).send({ message: 'Missing required fields' });
      }
      console.log('Adjusted Start Date:', req.reservation_date_start);
      console.log('Adjusted End Date:', req.reservation_date_end);
      const result = await this.service.Reservation_Create_Booking(req);
      return res.status(200).send(result);
    } catch (error: unknown) {
      console.error('Error in Reservation_Create_Booking:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Unknown error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/reservation_add_attendees')
  async Reservation_Add_Attendees(
    @Body()
    req: {
      reservation_id: number;
      UserID: string;
      note?: string;
      created_by: number;
    },
    @Res() res: Response,
  ): Promise<Response> {
    try {
      if (!req || !req.reservation_id || !req.UserID) {
        return res.status(400).send({ message: 'Missing required fields' });
      }
      const result = await this.service.Reservation_Add_Attendees(req);
      return res.status(200).send(result);
    } catch (error: unknown) {
      console.error('Error in Reservation_Add_Attendees:', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Unknown error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
