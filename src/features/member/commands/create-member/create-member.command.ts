import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { CreateMemberRequestDto } from '../../dtos/create-member-request.dto';

export class CreateMemberCommand extends Command<Result<void, ResultError>> {
  public constructor(
    public readonly userId: string,
    public readonly dto: CreateMemberRequestDto,
  ) {
    super();
  }
}
