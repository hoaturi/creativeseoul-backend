import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetMemberListResponseDto } from '../../dtos/responses/get-member-list-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { GetMemberListQueryDto } from '../../dtos/requests/get-member-list-query.dto';

export class GetMemberListQuery extends Query<
  Result<GetMemberListResponseDto, ResultError>
> {
  public constructor(public readonly dto: GetMemberListQueryDto) {
    super();
  }
}
