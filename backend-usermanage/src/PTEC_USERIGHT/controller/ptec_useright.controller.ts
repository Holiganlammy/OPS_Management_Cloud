// app.controller.ts
import { Get, Post, Put, Res, Controller, Header, Query, Body, Param } from '@nestjs/common';
import { AppService } from '../service/ptec_useright.service';
import { LoginDto } from '../dto/Login.dto';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { EditUserDto } from '../dto/EditUser.dto';
import { Response } from 'express';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/user')
  @Header('Content-Type', 'application/json')
  async getUser() {
    const users = await this.appService.getUsersFromProcedure();
    const filterOutUsers = users
      .map(({ password, ...user }) => user);
    return filterOutUsers;
  }

  // @Get('/login')
  // @Render('login')
  // getLogin() {
  //   return {};
  // }

  @Get('/login')
  async Login(@Query() loginDto: LoginDto, @Res() res: Response) {
    try {
      const resultLogin = await this.appService.getUserLogin(loginDto);
      if (resultLogin[0].password === 1) {
        res.status(200).send({
          success: true,
          user: resultLogin[0],
        })
      } else {
        res.status(400).send({
          success: false,
          message: 'Login failed. Please check your username and password.'
        });
      }
    } catch (error) {
      console.error('Error executing stored procedure:', error);
      throw error;
    }
  }

  @Post('/user/create')
  @Header('Content-Type', 'application/json')
  async createUser(@Body() createUser: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.appService.createUser(createUser);
      if (result.length > 0) {
        res.status(200).send({
          success: true,
          user: result
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send({
        success: false,
        message: 'Error creating user'
      });
    }
  }

  @Get('/branch')
  @Header('Content-Type', 'application/json')
  async getBranch(@Res() res: Response) {
    try {
      const branches = await this.appService.getBranch();
      res.status(200).send({
        success: true,
        data: branches
      });
    } catch (error) {
      console.error('Error fetching branches:', error);
      res.status(500).send({
        success: false,
        message: 'Error fetching branches'
      });
    }
  }

  @Get('/department')
  @Header('Content-Type', 'application/json')
  async getDepartment(@Res() res: Response) {
    try {
      const departments = await this.appService.getDepartment();
      const filterDepartments = departments.filter(
        (dept: any) => dept.branchid !== 0
      );
      res.status(200).send({
        success: true,
        data: filterDepartments
      });
    } catch (error) {
      console.error('Error fetching departments:', error);
      res.status(500).send({
        success: false,
        message: 'Error fetching departments'
      });
    }
  }

  @Get('/section')
  @Header('Content-Type', 'application/json')
  async getSection(@Res() res: Response) {
    try {
      const sections = await this.appService.getSection();
      const filterSections = sections.filter(
        (sec: any) => sec.secid !== 0
      );
      res.status(200).send({
        success: true,
        data: filterSections
      });
    } catch (error) {
      console.error('Error fetching sections:', error);
      res.status(500).send({
        success: false,
        message: 'Error fetching sections'
      });
    }
  }

  @Get('/position')
  @Header('Content-Type', 'application/json')
  async getPosition(@Res() res: Response) {
    try {
      const positions = await this.appService.getPosition();
      const filterPositions = positions.filter(
        (pos: any) => pos.positionid !== 0
      );
      res.status(200).send({
        success: true,
        data: filterPositions
      });
    } catch (error) {
      console.error('Error fetching positions:', error);
      res.status(500).send({
        success: false,
        message: 'Error fetching positions'
      });
    }
  }
  @Put('/user/:id')
  @Header('Content-Type', 'application/json')
  async getUserById(
    @Param('id') id: string,
    @Body() editUserDto: EditUserDto,
    @Res() res: Response
  ) {
    try {
      const user = await this.appService.editUser(id, editUserDto);
      if (user) {
        res.status(200).send({
          success: true,
          user
        });
      } else {
        res.status(404).send({
          success: false,
          message: 'User not found'
        });
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).send({
        success: false,
        message: 'Error fetching user by ID'
      });
    }
  }
  @Put('/user/delete/:UserID')
  @Header('Content-Type', 'application/json')
  async deleteUser(@Param('UserID') UserID: string, @Body('Actived') Actived: string, @Res() res: Response) {
    try {
      console.log('Deleting user with ID:', UserID, 'Actived:', Actived);
      await this.appService.deleteUser(UserID, Actived);
      res.status(200).send({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send({
        success: false,
        message: 'Error deleting user'
      });
    }
  }
}
