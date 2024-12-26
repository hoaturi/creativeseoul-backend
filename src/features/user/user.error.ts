import { ResultError } from '../../common/result/result-error';
import { UserErrorCode } from '../../domain/user/user-error-code.enum';
import { HttpStatus } from '@nestjs/common';

export class UserError extends ResultError {
  public static readonly NotFound = new ResultError(
    UserErrorCode.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'User not found',
  );

  public static readonly CurrentPasswordMismatch = new ResultError(
    UserErrorCode.CURRENT_PASSWORD_MISMATCH,
    HttpStatus.BAD_REQUEST,
    'Current password does not match',
  );

  public constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
