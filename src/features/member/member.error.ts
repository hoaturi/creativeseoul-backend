import { ResultError } from '../../common/result/result-error';
import { HttpStatus } from '@nestjs/common';
import { MemberErrorCode } from '../../domain/member/member-error-code.enum';

export class MemberError extends ResultError {
  public static readonly NotFound = new ResultError(
    MemberErrorCode.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Member not found',
  );

  public constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
