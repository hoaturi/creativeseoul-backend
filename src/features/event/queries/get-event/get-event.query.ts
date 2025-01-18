import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetEventResponseDto } from '../../dtos/get-event-response.dto';
import { ResultError } from '../../../../common/result/result-error';

export class GetEventQuery extends Query<
  Result<GetEventResponseDto, ResultError>
> {
  public constructor(public readonly slug: string) {
    super();
  }
}
