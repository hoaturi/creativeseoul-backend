import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { CreateRegularJobRequestDto } from '../../dtos/create-regular-job-request.dto';

export class CreateRegularJobCommand extends Command<
  Result<void, ResultError>
> {
  public constructor(public readonly dto: CreateRegularJobRequestDto) {
    super();
  }
}
