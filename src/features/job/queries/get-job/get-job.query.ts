import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetJobResponseDto } from '../../dtos/responses/get-job-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class GetJobQuery extends Query<Result<GetJobResponseDto, ResultError>> {
  public constructor(
    public readonly slug: string,
    public readonly user?: AuthenticatedUser,
  ) {
    super();
  }
}
