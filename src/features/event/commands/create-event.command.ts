import { Command } from '@nestjs/cqrs';
import { Result } from '../../../common/result/result';
import { ResultError } from '../../../common/result/result-error';
import { CreateEventRequestDto } from '../dtos/create-event-request.dto';

export class CreateEventCommand extends Command<Result<void, ResultError>> {
  public constructor(public readonly dto: CreateEventRequestDto) {
    super();
  }
}
