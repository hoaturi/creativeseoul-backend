import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetCompanyListResponseDto } from '../../dtos/responses/get-company-list-response.dto';
import { ResultError } from '../../../../common/result/result-error';

export class GetCompanyListQuery extends Query<
  Result<GetCompanyListResponseDto, ResultError>
> {
  public constructor() {
    super();
  }
}
