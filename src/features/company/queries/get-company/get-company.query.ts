import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetCompanyResponseDto } from '../../dtos/responses/get-company-response.dto';
import { ResultError } from '../../../../common/result/result-error';

export class GetCompanyQuery extends Query<
  Result<GetCompanyResponseDto, ResultError>
> {
  public constructor(public readonly id: string) {
    super();
  }
}
