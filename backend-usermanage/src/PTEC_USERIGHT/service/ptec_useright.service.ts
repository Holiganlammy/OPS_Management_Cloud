import { Injectable, OnModuleInit } from '@nestjs/common';
import { User } from '../domain/model/ptec_useright.entity';
import { Branch } from '../domain/model/ptec_useright.entity';
import { Department } from '../domain/model/ptec_useright.entity';
import { Section } from '../domain/model/ptec_useright.entity';
import { Position } from '../domain/model/ptec_useright.entity';
import { databaseConfig } from '../config/database.config';
import * as sql from 'mssql';
import { LoginDto } from '../dto/Login.dto';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { EditUserDto } from '../dto/EditUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService implements OnModuleInit {
  private pool: sql.ConnectionPool;
  private isConnected: boolean = false;

  constructor(private jwtService: JwtService) {}

  async onModuleInit() {
    await this.ConnectionDB();
  }

  private async ConnectionDB() {
    try {
      if (!this.pool) {
        this.pool = await sql.connect(databaseConfig);
        this.isConnected = true;
        console.log('Database connected successfully');
      }
    } catch (error) {
      console.error('Database connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }

  private async ensureConnection() {
    if (!this.isConnected || !this.pool) {
      await this.ConnectionDB();
    }
  }

  signToken(user: User): string {
    const payload = {
      userId: user.UserID,
      username: user.UserCode,
      role: user.PositionCode,
    };
    return this.jwtService.sign(payload);
  }

  async getUserLogin(req: LoginDto) {
    try {
      await this.ensureConnection();
      const result = await this.pool
        .request()
        .input('loginname', sql.VarChar, req.loginname)
        .input('password', sql.VarChar, req.password)
        .execute('dbo.User_Login');
      return result.recordset;
    } catch (error) {
      console.error('Login Failed :', error);
      return { success: false };
    }
  }

  async getUsersFromProcedure(): Promise<User[]> {
    try {
      await this.ensureConnection();

      const result = await this.pool.request().execute('dbo.User_List_II');
      return result.recordset as User[];
    } catch (error) {
      console.error('Error executing stored procedure:', error);
      throw error;
    }
  }
  async createUser(createUser: CreateUserDto) {
    try {
      const result = await this.pool
        .request()
        .input('Name', sql.VarChar, createUser.Name)
        .input('loginname', sql.VarChar, createUser.loginname)
        .input('branchid', sql.VarChar, createUser.branchid)
        .input('department', sql.VarChar, createUser.department)
        .input('secid', sql.VarChar, createUser.secid)
        .input('positionid', sql.VarChar, createUser.positionid)
        .input('empupper', sql.VarChar, createUser.empupper)
        .input('email', sql.VarChar, createUser.email)
        .input('password', sql.VarChar, createUser.password)
        .execute('dbo.User_Save');
      return result.recordset;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async editUser(id: string, editUserDto: EditUserDto) {
    try {
      const request = this.pool
        .request()
        .input('Name', sql.VarChar, editUserDto.Name)
        .input('loginname', sql.VarChar, editUserDto.loginname)
        .input('branchid', sql.VarChar, editUserDto.branchid)
        .input('department', sql.VarChar, editUserDto.department)
        .input('secid', sql.VarChar, editUserDto.secid)
        .input('positionid', sql.VarChar, editUserDto.positionid)
        .input('empupper', sql.VarChar, editUserDto.empupper)
        .input('email', sql.VarChar, editUserDto.email);
      if (editUserDto.password) {
        request.input('password', sql.VarChar, editUserDto.password);
      }
      const result = await request.execute('dbo.User_Save');
      return result.recordset;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  async deleteUser(ID: string, Actived: string): Promise<void> {
    try {
      await this.pool
        .request()
        .input('UserID', sql.VarChar, ID)
        .input('Actived', sql.VarChar, Actived)
        .execute('dbo.User_Delete');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getBranch(): Promise<Branch[]> {
    try {
      const result = await this.pool.request().execute('dbo.Branch_ListAll');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  }

  async getDepartment(): Promise<Department[]> {
    try {
      const result = await this.pool.request().execute('dbo.Department_List');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }

  async getSection(): Promise<Section[]> {
    try {
      const result = await this.pool.request().execute('dbo.Section_List');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching sections:', error);
      throw error;
    }
  }

  async getPosition(): Promise<Position[]> {
    try {
      const result = await this.pool.request().execute('dbo.Position_List');
      return result.recordset;
    } catch (error) {
      console.error('Error fetching positions:', error);
      throw error;
    }
  }
}
