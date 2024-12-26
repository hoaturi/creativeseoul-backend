import { Query } from '@nestjs/cqrs';
import { Result } from '../../../common/result/result';
import { GetMemberResponseDto } from '../dtos/responses/get-member-response.dto';
import { ResultError } from '../../../common/result/result-error';

export class GetMemberQuery extends Query<
  Result<GetMemberResponseDto, ResultError>
> {
  public constructor(public readonly handle: string) {
    super();
  }
}
