import { Command } from '@nestjs/cqrs';
import { Result } from '../../../common/result/result';
import { ResultError } from '../../../common/result/result-error';
import { CreateCandidateProfileRequestDto } from '../dtos/create-candidate-profile-request.dto';

export class CreateCandidateProfileCommand extends Command<
  Result<void, ResultError>
> {
  public constructor(
    public readonly userId: string,
    public readonly dto: CreateCandidateProfileRequestDto,
  ) {
    super();
  }
}
