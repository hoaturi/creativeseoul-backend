import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CustomException } from './custom.exception';
import { Response } from 'express';
import { Stripe } from 'stripe';
import { CommonErrorCode } from '../../domain/common/common-error-code.enum';

@Catch(CustomException, Stripe.errors.StripeError)
export class GlobalCustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalCustomExceptionFilter.name);

  public catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error(exception, exception.message);

    if (exception instanceof CustomException) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: exception.code,
        message: 'An internal server error occurred',
      });
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: CommonErrorCode.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occurred',
    });
  }
}
