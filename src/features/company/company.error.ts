import { ResultError } from '../../common/result/result-error';
import { HttpStatus } from '@nestjs/common';
import { CompanyErrorCode } from '../../domain/company/company-error-code.enum';

export class CompanyError extends ResultError {
  public static readonly ProfileAlreadyExists = new ResultError(
    CompanyErrorCode.PROFILE_ALREADY_EXISTS,
    HttpStatus.CONFLICT,
    'Company Profile already exists',
  );

  public static readonly ProfileNotFound = new ResultError(
    CompanyErrorCode.PROFILE_NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Company Profile not found',
  );

  public constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
