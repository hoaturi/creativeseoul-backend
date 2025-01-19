import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';
import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';

export class RenewFeaturedJobCommand extends Command<
  Result<void, ResultError>
> {
  public constructor(
    public readonly user: AuthenticatedUser,
    public readonly id: string,
  ) {
    super();
  }
}
