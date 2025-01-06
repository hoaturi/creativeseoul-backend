import { ResultError } from '../../common/result/result-error';
import { HttpStatus } from '@nestjs/common';
import { TalentErrorCode } from '../../domain/talent/talent-error-code.enum';

export class TalentError extends ResultError {
  public static readonly NotFound = new ResultError(
    TalentErrorCode.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Talent not found',
  );

  public constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
