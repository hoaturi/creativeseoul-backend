import { HttpStatus } from '@nestjs/common';
import { ResultError } from '../../common/result/result-error';
import { MemberErrorCode } from '../../domain/member/member-error-code.enum';

export class MemberError extends ResultError {
  public static readonly AlreadyExists = new MemberError(
    MemberErrorCode.ALREADY_EXISTS,
    HttpStatus.CONFLICT,
    'member already exists',
  );

  public static readonly NotFound = new MemberError(
    MemberErrorCode.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'member not found',
  );

  public static readonly NotAvailable = new MemberError(
    MemberErrorCode.NOT_AVAILABLE,
    HttpStatus.FORBIDDEN,
    'member not available',
  );

  public constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
