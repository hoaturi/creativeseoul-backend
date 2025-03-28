import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetJobListResponseDto } from '../../dtos/responses/get-job-list-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { GetJobListQueryDto } from '../../dtos/requests/get-job-list-query.dto';

export class GetJobListQuery extends Query<
  Result<GetJobListResponseDto, ResultError>
> {
  public constructor(public readonly dto: GetJobListQueryDto) {
    super();
  }
}
