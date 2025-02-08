import { ResultError } from '../../common/result/result-error';
import { HttpStatus } from '@nestjs/common';
import { CompanyErrorCode } from '../../domain/company/company-error-code.enum';

export class CompanyError extends ResultError {
  public static readonly ProfileNotFound = new ResultError(
    CompanyErrorCode.PROFILE_NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Company Profile not found',
  );

  public static readonly ProfileAlreadyClaimed = new ResultError(
    CompanyErrorCode.PROFILE_ALREADY_CLAIMED,
    HttpStatus.CONFLICT,
    'Company Profile already claimed',
  );

  public static readonly InvalidInvitationToken = new ResultError(
    CompanyErrorCode.INVALID_INVITATION_TOKEN,
    HttpStatus.BAD_REQUEST,
    'Invalid company invitation token',
  );

  public static readonly InsufficientCreditBalance = new ResultError(
    CompanyErrorCode.INSUFFICIENT_CREDIT_BALANCE,
    HttpStatus.BAD_REQUEST,
    'Insufficient credit balance',
  );

  public constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
