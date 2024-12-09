import { ResultError } from '../../common/result/result-error';
import { UserErrorCode } from '../../domain/user/user-error-code.enum';
import { HttpStatus } from '@nestjs/common';

export class UserError extends ResultError {
  public static readonly UserNotFound = new ResultError(
    UserErrorCode.UserNotFound,
    HttpStatus.NOT_FOUND,
    'User not found',
  );

  constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
