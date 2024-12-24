import { ResultError } from '../../common/result/result-error';
import { HttpStatus } from '@nestjs/common';
import { CandidateErrorCode } from '../../domain/candidate/candidate-error-code.enum';

export class CandidateError extends ResultError {
  public static readonly NotFound = new ResultError(
    CandidateErrorCode.NOT_FOUND,
    HttpStatus.BAD_REQUEST,
    'Candidate not found',
  );

  public constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
