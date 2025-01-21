import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetJobListResponseDto } from '../../dtos/responses/get-job-list-response.dto';
import { ResultError } from '../../../../common/result/result-error';

export class GetRegularJobListQuery extends Query<
  Result<GetJobListResponseDto, ResultError>
> {
  public constructor() {
    super();
  }
}
