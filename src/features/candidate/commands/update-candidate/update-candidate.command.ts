import { UpdateCandidateRequestDto } from '../../dtos/update-candidate-request.dto';
import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';

export class UpdateCandidateCommand extends Command<Result<void, ResultError>> {
  public constructor(
    public readonly userId: string,
    public readonly dto: UpdateCandidateRequestDto,
  ) {
    super();
  }
}
