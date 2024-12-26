import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { UpsertCandidateRequestDto } from '../../dtos/upsert-candidate-request.dto';

export class UpsertCandidateCommand extends Command<Result<void, ResultError>> {
  public constructor(
    public readonly profileId: string,
    public readonly dto: UpsertCandidateRequestDto,
  ) {
    super();
  }
}
