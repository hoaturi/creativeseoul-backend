import { ResultError } from '../../common/result/result-error';
import { HttpStatus } from '@nestjs/common';
import { TalentErrorCode } from '../../domain/talent/talent-error-code.enum';

export class TalentError extends ResultError {
  public static readonly ProfileNotFound = new ResultError(
    TalentErrorCode.PROFILE_NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Talent profile not found',
  );

  public static readonly ProfileAlreadyExists = new ResultError(
    TalentErrorCode.PROFILE_ALREADY_EXISTS,
    HttpStatus.CONFLICT,
    'Talent profile already exists',
  );

  public static readonly ContactInfoMissing = new ResultError(
    TalentErrorCode.CONTACT_INFO_MISSING,
    HttpStatus.BAD_REQUEST,
    'Contact information missing',
  );

  public constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
