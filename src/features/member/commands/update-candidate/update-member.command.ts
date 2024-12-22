import { UpdateMemberRequestDto } from '../../dtos/update-member-request.dto';
import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';

export class UpdateMemberCommand extends Command<Result<void, ResultError>> {
  public constructor(
    public readonly userId: string,
    public readonly dto: UpdateMemberRequestDto,
  ) {
    super();
  }
}
