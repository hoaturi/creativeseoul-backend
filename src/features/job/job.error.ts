import { ResultError } from '../../common/result/result-error';
import { HttpStatus } from '@nestjs/common';
import { JobErrorCode } from '../../domain/job/job-error-code.enum';

export class JobError extends ResultError {
  public static readonly NotFound = new ResultError(
    JobErrorCode.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Job not found',
  );
}
