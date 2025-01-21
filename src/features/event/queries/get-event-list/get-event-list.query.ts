import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetEventListResponseDto } from '../../dtos/get-event-list-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { GetEventListQueryDto } from '../../dtos/get-event-list-query.dto';

export class GetEventListQuery extends Query<
  Result<GetEventListResponseDto, ResultError>
> {
  public constructor(public readonly dto: GetEventListQueryDto) {
    super();
  }
}
