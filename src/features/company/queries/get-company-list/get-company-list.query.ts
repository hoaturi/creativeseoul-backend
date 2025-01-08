import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetCompanyListResponseDto } from '../../dtos/get-company-list-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { GetCompanyListQueryDto } from '../../dtos/requests/get-company-list-query.dto';

export class GetCompanyListQuery extends Query<
  Result<GetCompanyListResponseDto, ResultError>
> {
  public constructor(public readonly dto: GetCompanyListQueryDto) {
    super();
  }
}
