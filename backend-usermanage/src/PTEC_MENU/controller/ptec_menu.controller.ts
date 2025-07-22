import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Apps_MenuInput } from '../dto/FA_Control.dto';
import { AppService } from '../service/ptec_menu.service';

@Controller('')
export class AppController {
  constructor(private readonly service: AppService) {}

  @Post('/Apps_List_Menu')
  async Apps_List_Menu(@Body() body: Apps_MenuInput, @Res() res: Response) {
    try {
      const result = await this.service.Apps_List_Menu(body);
      res.status(200).send(result);
    } catch (error: unknown) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Unknown error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
