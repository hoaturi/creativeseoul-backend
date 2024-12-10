import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { GetCurrentUserResponseDto } from '../../dtos/get-current-user-response.dto';

export class GetCurrentUserQuery extends Query<
  Result<GetCurrentUserResponseDto, ResultError>
> {
  public constructor(public readonly userId: string) {
    super();
  }
}
