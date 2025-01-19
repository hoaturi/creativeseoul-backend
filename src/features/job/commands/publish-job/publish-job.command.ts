import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class PublishJobCommand extends Command<Result<void, ResultError>> {
  public constructor(
    public readonly user: AuthenticatedUser,
    public readonly id: string,
  ) {
    super();
  }
}
