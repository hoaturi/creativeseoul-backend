import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Query } from '@nestjs/cqrs';
import { GetMemberResponseDto } from '../../dtos/get-member-response.dto';

export class GetMemberQuery extends Query<
  Result<GetMemberResponseDto, ResultError>
> {
  public constructor(
    public readonly userId: string,
    public readonly memberId: string,
  ) {
    super();
  }
}
