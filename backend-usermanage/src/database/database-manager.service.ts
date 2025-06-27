import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { defaultServerConfig } from 'src/config/multi-database.config';

@Injectable()
export class DatabaseManagerService {
  private pool: sql.ConnectionPool;

  async getPool(): Promise<sql.ConnectionPool> {
    if (!this.pool) {
      this.pool = await new sql.ConnectionPool(defaultServerConfig).connect();
      console.log(`Connected to SQL Server: ${defaultServerConfig.server}`);
    }
    return this.pool;
  }

  async executeStoredProcedure<T = any>(
    fullyQualifiedProcName: string,
    inputs: { name: string; type: sql.ISqlType; value: any }[],
  ): Promise<T[]> {
    const pool = await this.getPool();
    const request = pool.request();
    for (const input of inputs) {
      request.input(input.name, input.type, input.value);
    }
    const result = await request.execute(fullyQualifiedProcName);
    return result.recordset;
  }

  async query<T = any>(sqlText: string): Promise<T[]> {
    const pool = await this.getPool();
    const result = await pool.request().query(sqlText);
    return result.recordset;
  }
}
