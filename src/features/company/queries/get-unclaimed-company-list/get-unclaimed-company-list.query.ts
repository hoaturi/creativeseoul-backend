import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetUnclaimedCompanyListResponseDto } from '../../dtos/responses/get-unclaimed-company-list-response.dto';
import { ResultError } from '../../../../common/result/result-error';

export class GetUnclaimedCompanyListQuery extends Query<
  Result<GetUnclaimedCompanyListResponseDto, ResultError>
> {
  public constructor() {
    super();
  }
}
