import { ResultError } from '../../common/result/result-error';
import { CommonErrorCode } from '../../domain/common/common-error-code.enum';
import { HttpStatus } from '@nestjs/common';

export class CommonError extends ResultError {
  public static readonly ValidationFailed = new ResultError(
    CommonErrorCode.VALIDATION_FAILED,
    HttpStatus.BAD_REQUEST,
    'Validation failed',
  );

  public constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
