import { HttpStatus } from '@nestjs/common';
import { ResultError } from '../../common/result/result-error';
import { CandidateErrorCode } from '../../domain/candidate/candidate-error-code.enum';

export class CandidateError extends ResultError {
  public static readonly ProfileAlreadyExists = new CandidateError(
    CandidateErrorCode.PROFILE_ALREADY_EXISTS,
    HttpStatus.CONFLICT,
    'Profile already exists',
  );

  public constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
