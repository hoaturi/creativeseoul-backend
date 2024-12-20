import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { CreateCandidateRequestDto } from '../../dtos/create-candidate-request.dto';

export class CreateCandidateCommand extends Command<Result<void, ResultError>> {
  public constructor(
    public readonly userId: string,
    public readonly dto: CreateCandidateRequestDto,
  ) {
    super();
  }
}
