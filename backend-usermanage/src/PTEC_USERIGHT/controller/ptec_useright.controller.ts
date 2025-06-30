import {
  Get,
  Post,
  Put,
  Res,
  Controller,
  Query,
  Body,
  Param,
} from '@nestjs/common';
import { AppService } from '../service/ptec_useright.service';
import { LoginDto } from '../dto/Login.dto';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { EditUserDto } from '../dto/EditUser.dto';
import { Response } from 'express';
import { Public } from '../../auth/decorators/public.decorator';
import {
  Department,
  Position,
  Section,
  User,
} from '../domain/model/ptec_useright.entity';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/users')
  async getUser() {
    const users = await this.appService.getUsersFromProcedure();
    const filterOutUsers = users.map(({ ...user }) => user);
    return filterOutUsers;
  }

  @Public()
  @Get('/login')
  async Login(@Query() loginDto: LoginDto, @Res() res: Response) {
    try {
      const resultLogin = await this.appService.getUserLogin(loginDto);
      const user = resultLogin[0] as User;
      if (user && user.password === 1) {
        const payload = {
          userId: user.UserID,
          username: user.UserCode,
          role: user.PositionCode,
        };
        const token = this.appService['jwtService'].sign(payload);
        res.status(200).send({
          success: true,
          access_token: token,
          user,
        });
      } else {
        res.status(400).send({
          success: false,
          message: 'Login failed. Please check your username and password.',
        });
      }
    } catch (error) {
      console.error('Error executing stored procedure:', error);
      throw error;
    }
  }

  @Post('/user/create')
  async createUser(@Body() createUser: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.appService.createUser(createUser);
      if (result.length > 0) {
        res.status(200).send({
          success: true,
          user: result,
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send({
        success: false,
        message: 'Error creating user',
      });
    }
  }

  @Get('/branch')
  async getBranch(@Res() res: Response) {
    try {
      const branches = await this.appService.getBranch();
      res.status(200).send({
        success: true,
        data: branches,
      });
    } catch (error) {
      console.error('Error fetching branches:', error);
      res.status(500).send({
        success: false,
        message: 'Error fetching branches',
      });
    }
  }

  @Get('/department')
  async getDepartment(@Res() res: Response) {
    try {
      const departments = await this.appService.getDepartment();
      const filterDepartments = departments.filter(
        (dept: Department) => dept.branchid !== 0,
      );
      res.status(200).send({
        success: true,
        data: filterDepartments,
      });
    } catch (error) {
      console.error('Error fetching departments:', error);
      res.status(500).send({
        success: false,
        message: 'Error fetching departments',
      });
    }
  }

  @Get('/section')
  async getSection(@Res() res: Response) {
    try {
      const sections = await this.appService.getSection();
      const filterSections = sections.filter((sec: Section) => sec.secid !== 0);
      res.status(200).send({
        success: true,
        data: filterSections,
      });
    } catch (error) {
      console.error('Error fetching sections:', error);
      res.status(500).send({
        success: false,
        message: 'Error fetching sections',
      });
    }
  }

  @Get('/position')
  async getPosition(@Res() res: Response) {
    try {
      const positions = await this.appService.getPosition();
      const filterPositions = positions.filter(
        (pos: Position) => pos.positionid !== 0,
      );
      res.status(200).send({
        success: true,
        data: filterPositions,
      });
    } catch (error) {
      console.error('Error fetching positions:', error);
      res.status(500).send({
        success: false,
        message: 'Error fetching positions',
      });
    }
  }

  @Put('/user/:id')
  async getUserById(
    @Param('id') id: string,
    @Body() editUserDto: EditUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.appService.editUser(id, editUserDto);
      if (user) {
        res.status(200).send({
          success: true,
          user,
        });
      } else {
        res.status(404).send({
          success: false,
          message: 'User not found',
        });
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).send({
        success: false,
        message: 'Error fetching user by ID',
      });
    }
  }

  @Put('/user/delete/:UserID')
  async deleteUser(
    @Param('UserID') UserID: string,
    @Body('Actived') Actived: string,
    @Res() res: Response,
  ) {
    try {
      console.log('Deleting user with ID:', UserID, 'Actived:', Actived);
      await this.appService.deleteUser(UserID, Actived);
      res.status(200).send({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send({
        success: false,
        message: 'Error deleting user',
      });
    }
  }
}
