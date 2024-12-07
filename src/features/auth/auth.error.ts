import { HttpStatus } from '@nestjs/common';
import { ResultError } from '../../common/result/result-error';
import { AuthErrorCode } from '../../domain/auth/auth-error-code.enum';

export class AuthError extends ResultError {
  public static readonly InvalidCredentials = new AuthError(
    AuthErrorCode.INVALID_CREDENTIALS,
    HttpStatus.UNAUTHORIZED,
    'Invalid credentials',
  );

  public static readonly EmailAlreadyExists = new AuthError(
    AuthErrorCode.EMAIL_ALREADY_EXISTS,
    HttpStatus.CONFLICT,
    'Email already in use',
  );

  constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
