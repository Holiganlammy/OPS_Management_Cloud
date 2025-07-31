import {
  Get,
  Post,
  Res,
  Controller,
  Body,
  Query,
  Inject,
  HttpException,
  HttpStatus,
  Put,
  Param,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from '../service/ptec_useright.service';
import { LoginDto, VerifyOtpDto } from '../dto/Login.dto';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { EditUserDto } from '../dto/EditUser.dto';
import { Public } from '../../auth/decorators/public.decorator';
import {
  Department,
  Position,
  Section,
  User,
} from '../domain/model/ptec_useright.entity';
import { Redis } from 'ioredis';
import { sendOtpEmail } from 'src/utils/email';

@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

  @Get('/users')
  async getUser(@Query('usercode') usercode?: string | null) {
    const users = await this.appService.getUsersFromProcedure(usercode || null);
    const filterOutUsers = users.map(({ ...user }) => user);
    return filterOutUsers;
  }

  @Public()
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const resultLogin = await this.appService.getUserLogin(loginDto);
      const user = resultLogin[0] as User;

      if (!user || user.password !== 1) {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid credentials' });
      }

      const cookies = req.cookies as Record<string, string> | undefined;
      const trustedId = cookies?.trusted_device;
      if (trustedId) {
        const userAgent = req.headers['user-agent'] || 'unknown';
        const ipAddress =
          req.ip ||
          (req.headers['x-forwarded-for'] as string | undefined)?.split(
            ',',
          )[0] ||
          'unknown';

        const isTrusted = await this.appService.checkTrustedDevice({
          userCode: user.UserCode,
          deviceId: trustedId,
          userAgent,
          ipAddress,
        });

        if (isTrusted) {
          const payload = {
            userId: user.UserID,
            username: user.UserCode,
            role: user.PositionCode,
          };

          const token = this.appService['jwtService'].sign(payload);

          return res.status(200).json({
            success: true,
            access_token: token,
            user,
          });
        }
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const key = `mfa:${user.UserCode}`;
      const ttl = 300; // 5 นาที

      await this.redis.setex(key, ttl, otp);
      await sendOtpEmail(user.Email, user, otp);

      const expiresAt = Date.now() + ttl * 1000;

      return res.status(200).json({
        success: true,
        error: 'MFA_REQUIRED',
        userCode: user.UserCode,
        message: 'OTP sent to your email',
        expiresAt,
      });
    } catch (error: unknown) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Unknown error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Post('/resend-otp')
  async resendOtp(@Body() body: { usercode: string }, @Res() res: Response) {
    const usercode = body.usercode;

    const resultLogin = await this.appService.getUsersFromProcedure(usercode);
    const user = resultLogin[0];

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const ttl = 300; // 5 minutes
    const key = `mfa:${usercode}`;
    await this.redis.setex(key, ttl, otp);
    await sendOtpEmail(user.Email, user, otp);

    return res.status(200).json({
      success: true,
      message: 'OTP resent',
      expiresAt: Date.now() + ttl * 1000,
    });
  }

  @Public()
  @Post('/verify-otp')
  async verifyOtp(
    @Body() body: VerifyOtpDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { usercode, otpCode, trustDevice } = body;
    const key = `mfa:${usercode}`;

    const storedOtp = await this.redis.get(key);
    console.log(
      `Stored OTP for ${usercode}: ${storedOtp} vs Provided OTP: ${otpCode}`,
    );
    if (!storedOtp || storedOtp !== otpCode) {
      return res.status(401).json({
        success: false,
        error: 'OTP_INVALID',
        message: 'Invalid or expired OTP',
      });
    }

    await this.redis.del(key);

    const resultLogin: User[] =
      await this.appService.getUsersFromProcedure(usercode);
    const user = resultLogin[0];
    const payload = {
      userId: user.UserID,
      username: user.UserCode,
      role: user.PositionCode,
    };
    console.log(trustDevice);

    const token = this.appService['jwtService'].sign(payload);
    if (trustDevice === true || trustDevice === 'true') {
      console.log('Trusting device for user:', user.UserCode);
      const trustedId = crypto.randomUUID();
      console.log('User-Agent:', req.headers['user-agent']);
      const userAgent = req.headers['user-agent'] || 'unknown';
      const ipAddress =
        req.ip ||
        (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0] ||
        'unknown';
      console.log(
        `Saving trusted device for user ${user.UserCode}: ${trustedId}, User Agent: ${userAgent}, IP Address: ${ipAddress}`,
      );
      // await this.appService.saveTrustedDevice({
      //   userCode: user.UserCode,
      //   deviceId: trustedId,
      //   userAgent,
      //   ipAddress,
      // });
      // res.cookie('trusted_device', trustedId, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production',
      //   sameSite: 'strict',
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      // });
    }
    return res.status(200).json({
      success: true,
      access_token: token,
      user,
    });
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
