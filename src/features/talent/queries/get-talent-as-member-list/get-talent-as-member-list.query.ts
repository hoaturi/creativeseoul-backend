import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetTalentAsMemberListResponseDto } from '../../dtos/responses/get-talent-as-member-list-response.dto';
import { ResultError } from '../../../../common/result/result-error';

export class GetTalentAsMemberListQuery extends Query<
  Result<GetTalentAsMemberListResponseDto, ResultError>
> {
  public constructor(
    public readonly page?: number,
    public readonly search?: string,
  ) {
    super();
  }
}
