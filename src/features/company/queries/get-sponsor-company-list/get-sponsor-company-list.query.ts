import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { GetSponsorCompanyListResponseDto } from '../../dtos/responses/get-sponsor-company-list-response.dto';

export class GetSponsorCompanyListQuery extends Query<
  Result<GetSponsorCompanyListResponseDto, ResultError>
> {
  public constructor() {
    super();
  }
}
