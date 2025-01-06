import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { UpsertTalentRequestDto } from '../../dtos/requests/upsert-talent-request.dto';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class UpsertTalentCommand extends Command<Result<void, ResultError>> {
  public constructor(
    public readonly user: AuthenticatedUser,
    public readonly dto: UpsertTalentRequestDto,
  ) {
    super();
  }
}
