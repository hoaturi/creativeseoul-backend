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

  public static readonly InvalidToken = new AuthError(
    AuthErrorCode.INVALID_TOKEN,
    HttpStatus.BAD_REQUEST,
    'Invalid token',
  );

  public static readonly EmailNotVerified = new AuthError(
    AuthErrorCode.EMAIL_NOT_VERIFIED,
    HttpStatus.UNAUTHORIZED,
    'Email not verified',
  );

  public static readonly Unauthenticated = new AuthError(
    AuthErrorCode.UNAUTHENTICATED,
    HttpStatus.UNAUTHORIZED,
    'Unauthenticated',
  );

  public constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
