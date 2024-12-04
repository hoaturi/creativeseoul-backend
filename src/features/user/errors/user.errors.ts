import { ResultError } from '../../../common/result/result-error';
import { HttpStatus } from '@nestjs/common';
import { UserErrorCode } from '../../../domain/user/user-error-code.enum';

export class UserErrors extends ResultError {
  public static readonly InvalidCredentials = new UserErrors(
    UserErrorCode.INVALID_CREDENTIALS,
    HttpStatus.UNAUTHORIZED,
    'Invalid credentials',
  );

  public static readonly EmailAlreadyExists = new UserErrors(
    UserErrorCode.EMAIL_ALREADY_EXISTS,
    HttpStatus.CONFLICT,
    'Email already in use',
  );

  constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
