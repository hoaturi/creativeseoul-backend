import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { GetMyJobListResponseDto } from '../../dtos/get-my-job-list-response.dto';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class GetMyJobListQuery extends Query<
  Result<GetMyJobListResponseDto, ResultError>
> {
  public constructor(public readonly user: AuthenticatedUser) {
    super();
  }
}
