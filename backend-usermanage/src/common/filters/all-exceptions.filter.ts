// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('🔥 Exception Filter ถูกเรียก:', exception);
    console.log('🔍 Exception type:', typeof exception);
    console.log('🔍 Is HttpException:', exception instanceof HttpException);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: any = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      console.log('📦 Exception Response:', exceptionResponse);
      console.log('📦 Exception Response Type:', typeof exceptionResponse);
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        responseBody = {
          ...exceptionResponse,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      } else {
        // ถ้า response เป็น string
        responseBody = {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: exceptionResponse,
        };
      }
    }

    console.log('📤 Final Response Body:', responseBody);
    return response.status(status).json(responseBody);
  }
}
