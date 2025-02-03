import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetTalentAsMemberResponseDto } from '../../dtos/responses/get-talent-as-member-response.dto';
import { ResultError } from '../../../../common/result/result-error';

export class GetTalentAsMemberQuery extends Query<
  Result<GetTalentAsMemberResponseDto, ResultError>
> {
  public constructor(public readonly handle: string) {
    super();
  }
}
