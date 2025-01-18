import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetEventListResponseDto } from '../../dtos/get-event-list-response.dto';
import { ResultError } from '../../../../common/result/result-error';

export class GetEventListQuery extends Query<
  Result<GetEventListResponseDto, ResultError>
> {
  public constructor() {
    super();
  }
}
