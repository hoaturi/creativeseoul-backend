import { ResultError } from '../../common/result/result-error';
import { HttpStatus } from '@nestjs/common';
import { ProfessionalErrorCode } from '../../domain/professional/professional-error-code.enum';

export class ProfessionalError extends ResultError {
  public static readonly NotFound = new ResultError(
    ProfessionalErrorCode.NOT_FOUND,
    HttpStatus.BAD_REQUEST,
    'Candidate not found',
  );

  public constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
