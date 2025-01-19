import { Command } from '@nestjs/cqrs';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';

export class UnpublishJobCommand extends Command<Result<void, ResultError>> {
  public constructor(
    public readonly user: AuthenticatedUser,
    public readonly id: string,
  ) {
    super();
  }
}
