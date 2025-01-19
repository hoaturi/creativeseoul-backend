import { ResultError } from '../../common/result/result-error';
import { HttpStatus } from '@nestjs/common';
import { JobErrorCode } from '../../domain/job/job-error-code.enum';

export class JobError extends ResultError {
  public static readonly NotFound = new ResultError(
    JobErrorCode.NOT_FOUND,
    HttpStatus.NOT_FOUND,
    'Job not found',
  );

  public static readonly PermissionDenied = new ResultError(
    JobErrorCode.PERMISSION_DENIED,
    HttpStatus.FORBIDDEN,
    'Permission denied',
  );

  public static readonly AlreadyPublished = new ResultError(
    JobErrorCode.ALREADY_PUBLISHED,
    HttpStatus.BAD_REQUEST,
    'Job is already published',
  );

  public static readonly AlreadyFeatured = new ResultError(
    JobErrorCode.ALREADY_FEATURED,
    HttpStatus.BAD_REQUEST,
    'Job is already featured',
  );
}
