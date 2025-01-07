import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { UpdateTalentRequestDto } from '../../dtos/requests/update-talent-request.dto';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class UpdateTalentCommand extends Command<Result<void, ResultError>> {
  public constructor(
    public readonly user: AuthenticatedUser,
    public readonly dto: UpdateTalentRequestDto,
  ) {
    super();
  }
}
