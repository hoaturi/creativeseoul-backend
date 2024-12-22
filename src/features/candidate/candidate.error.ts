import { HttpStatus } from '@nestjs/common';
import { ResultError } from '../../common/result/result-error';
import { CandidateErrorCode } from '../../domain/candidate/candidate-error-code.enum';

export class CandidateError extends ResultError {
  public static readonly AlreadyExists = new CandidateError(
    CandidateErrorCode.ALREADY_EXISTS,
    HttpStatus.CONFLICT,
    'Candidate already exists',
  );

  public static readonly NotFound = new CandidateError(
    CandidateErrorCode.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Candidate not found',
  );

  public static readonly NotAvailable = new CandidateError(
    CandidateErrorCode.NOT_AVAILABLE,
    HttpStatus.FORBIDDEN,
    'Candidate not available',
  );

  public constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
