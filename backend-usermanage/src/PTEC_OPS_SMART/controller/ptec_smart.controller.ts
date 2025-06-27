import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { SmartBillService } from '../service/ptec_smart.service';
import { CreateSmartBillDto } from '../domain/model/ptec_smart.entity';
import {
  SmartBillAssociateInput,
  SmartBillOperationInput,
  SmartBillHeaderInput,
  SmartBill_CarInfoSearchInput,
} from '../dto/SmartBill.dto';

@Controller('')
export class SmartBillController {
  constructor(private readonly smartBillService: SmartBillService) {}

  @Post('SmartBill_CreateForms')
  @HttpCode(200)
  async createSmartBill(@Body() dataBody: CreateSmartBillDto): Promise<string> {
    try {
      const header = dataBody.smartBill_Header[0];
      const car = dataBody.carInfo[0];

      const headerInput: SmartBillHeaderInput = {
        usercode: header.usercode || 'SYSTEM',
        sb_code: dataBody.sb_code ?? '',
        sb_name: header.sb_name,
        sb_fristName: header.sb_fristName,
        sb_lastName: header.sb_lastName,
        clean_status: Number(header.clean_status),
        group_status: Number(header.group_status),
        car_infocode: car.car_infocode,
        reamarks: header.reamarks,
        car_infostatus_companny: car.car_infostatus_companny as boolean,
        car_categaryid: car.car_categaryid,
        car_typeid: car.car_typeid,
        car_band: car.car_band,
        car_tier: car.car_tier,
        car_color: car.car_color,
        car_remarks: car.car_remarks,
      };

      const headerResult = (await this.smartBillService.SmartBill_CreateForms(
        headerInput,
      )) as { sb_code?: string }[];
      const sb_code = (headerResult[0]?.sb_code as string) || undefined;
      if (!sb_code) {
        throw new HttpException(
          'ไม่สามารถสร้าง SmartBill ได้',
          HttpStatus.BAD_REQUEST,
        );
      }

      for (const op of dataBody.smartBill_Operation) {
        await this.smartBillService.SmartBill_CreateOperation(
          op as SmartBillOperationInput,
          sb_code,
        );
      }

      if (Number(header.group_status) === 1) {
        for (const associate of dataBody.smartBill_Associate) {
          await this.smartBillService.SmartBill_CreateAssociate(
            associate as SmartBillAssociateInput,
            sb_code,
          );
        }
      }

      return sb_code;
    } catch (error) {
      console.error('[SmartBill_CreateForms] Error:', error);
      throw new HttpException(
        'Internal Server Error: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('SmartBill_CarInfoSearch')
  @HttpCode(200)
  async SmartBill_CarInfoSearch(
    @Body() body: SmartBill_CarInfoSearchInput,
  ): Promise<SmartBill_CarInfoSearchInput[]> {
    try {
      const carInfo = await this.smartBillService.SmartBill_CarInfoSearch(body);
      if (carInfo.length === 0) {
        throw new HttpException('ไม่พบข้อมูลรถยนต์', HttpStatus.NOT_FOUND);
      }
      return carInfo as SmartBill_CarInfoSearchInput[];
    } catch (error) {
      console.error('[SmartBill_CarInfoSearch] Error:', error);
      throw new HttpException(
        'Internal Server Error: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
