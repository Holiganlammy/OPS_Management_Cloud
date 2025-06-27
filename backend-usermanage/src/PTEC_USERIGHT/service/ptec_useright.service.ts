import { Injectable } from '@nestjs/common';
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
import { DatabaseManagerService } from 'src/database/database-manager.service';

@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    private readonly dbManager: DatabaseManagerService,
  ) {}

  signToken(user: User): string {
    const payload = {
      userId: user.UserID,
      username: user.UserCode,
      role: user.PositionCode,
    };
    return this.jwtService.sign(payload);
  }

  async getUserLogin(req: LoginDto) {
    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.User_Login`,
      [
        { name: 'loginname', type: sql.NVarChar(50), value: req.loginname },
        { name: 'password', type: sql.NVarChar(50), value: req.password },
      ],
    );
  }

  async getUsersFromProcedure(): Promise<User[]> {
    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.User_List_II`,
      [],
    );
  }

  async createUser(req: CreateUserDto) {
    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.User_Save`,
      [
        { name: 'Name', type: sql.NVarChar(100), value: req.Name },
        { name: 'loginname', type: sql.NVarChar(20), value: req.loginname },
        { name: 'branchid', type: sql.Int(), value: req.branchid },
        { name: 'department', type: sql.NVarChar(20), value: req.department },
        { name: 'secid', type: sql.Int(), value: req.secid },
        { name: 'positionid', type: sql.Int(), value: req.positionid },
        { name: 'empupper', type: sql.NVarChar(10), value: req.empupper },
        { name: 'email', type: sql.NVarChar(100), value: req.email },
        { name: 'password', type: sql.NVarChar(50), value: req.password },
      ],
    );
  }

  async editUser(id: string, req: EditUserDto) {
    const params = [
      { name: 'Name', type: sql.NVarChar(100), value: req.Name },
      { name: 'loginname', type: sql.NVarChar(20), value: req.loginname },
      { name: 'branchid', type: sql.Int(), value: req.branchid },
      { name: 'department', type: sql.NVarChar(20), value: req.department },
      { name: 'secid', type: sql.Int(), value: req.secid },
      { name: 'positionid', type: sql.Int(), value: req.positionid },
      { name: 'empupper', type: sql.NVarChar(10), value: req.empupper },
      { name: 'email', type: sql.NVarChar(100), value: req.email },
    ];

    if (req.password) {
      params.push({
        name: 'password',
        type: sql.NVarChar(50),
        value: req.password,
      });
    }

    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.User_Save`,
      params,
    );
  }

  async deleteUser(ID: string, Actived: string): Promise<void> {
    await this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.User_Delete`,
      [
        { name: 'UserID', type: sql.VarChar(50), value: ID },
        { name: 'Actived', type: sql.VarChar(10), value: Actived },
      ],
    );
  }

  async getBranch(): Promise<Branch[]> {
    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.Branch_ListAll`,
      [],
    );
  }

  async getDepartment(): Promise<Department[]> {
    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.Department_List`,
      [],
    );
  }

  async getSection(): Promise<Section[]> {
    return this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.Section_List`,
      [],
    );
  }

  async getPosition(): Promise<Position[]> {
    return await this.dbManager.executeStoredProcedure(
      `${databaseConfig.database}.dbo.Position_List`,
      [],
    );
  }
}
