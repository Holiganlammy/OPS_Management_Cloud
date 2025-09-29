import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { DatabaseManagerService } from 'src/database/database-manager.service';
import { databaseConfig } from '../config/database.config';
import {
  ReservationCreateBookingDto,
  ReservationGet_Car_ID,
} from '../dto/Reservation_Car.dto';
// import { Apps_MenuInput } from '../dto/FA_Control.dto';

@Injectable()
export class AppService {
  constructor(private readonly dbManager: DatabaseManagerService) {}

  async Reservation_cars_Get() {
    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.ReservationSys_Car_GetAvailableCars`,
      [],
    );
  }

  async Reservation_Meeting_Rooms_Get() {
    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.ReservationSys_MeetingRoom_GetAvailableRooms`,
      [],
    );
  }

  async Reservation_Car_GetById(req: { car_id: ReservationGet_Car_ID }) {
    const params = [{ name: 'car_id', type: sql.Int(), value: req.car_id }];
    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.ReservationSys_Car_GetDetailById`,
      params,
    );
  }

  async Reservation_Create_Booking(req: ReservationCreateBookingDto) {
    const params = [
      { name: 'UserID', type: sql.Int(), value: req.UserID },
      { name: 'car_infoid', type: sql.Int(), value: req.car_infoid },
      { name: 'meeting_room_id', type: sql.Int(), value: req.meeting_room_id },
      {
        name: 'reservation_detail',
        type: sql.NVarChar(500),
        value: req.reservation_detail,
      },
      { name: 'reason_name', type: sql.NVarChar(255), value: req.reason_name },
      { name: 'destination', type: sql.NVarChar(255), value: req.destination },
      {
        name: 'reservation_date_start',
        type: sql.DateTimeOffset(),
        value: req.reservation_date_start,
      },
      {
        name: 'reservation_date_end',
        type: sql.DateTimeOffset(),
        value: req.reservation_date_end,
      },
    ];
    console.log('Creating booking with params:', params);
    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.ReservationSys_CreateBooking`,
      params,
    );
  }

  async Reservation_Add_Attendees(req: {
    reservation_id: number;
    UserID: string;
    note?: string;
    created_by: number;
  }) {
    const params = [
      { name: 'reservation_id', type: sql.Int(), value: req.reservation_id },
      {
        name: 'UserID',
        type: sql.Int(),
        value: req.UserID,
      },
      {
        name: 'note',
        type: sql.NVarChar(500),
        value: req.note || '',
      },
      {
        name: 'created_by',
        type: sql.Int(),
        value: req.created_by,
      },
    ];
    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.ReservationSys_AddAttendee`,
      params,
    );
  }

  async Reservation_Get_Billing(reservation_id: number) {
    const params = [
      { name: 'reservation_id', type: sql.Int(), value: reservation_id },
    ];
    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.ReservationSys_GetReservationSummaryById`,
      params,
    );
  }

  async Reservation_GetBookingBillOnCalendar() {
    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.ReservationSys_GetBookingBillOnCalendar_Car`,
      [],
    );
  }
}
