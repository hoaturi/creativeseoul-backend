import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CustomException } from './custom.exception';
import { Response } from 'express';

@Catch(CustomException)
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  public catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof CustomException) {
      this.logger.error(
        {
          err: exception,
        },
        exception.message,
      );

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: exception.code,
        message: 'An internal server error occurred',
      });
    }
  }
}
