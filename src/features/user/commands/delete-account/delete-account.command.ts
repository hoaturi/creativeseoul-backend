import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class DeleteAccountCommand extends Command<Result<void, ResultError>> {
  public constructor(public readonly user: AuthenticatedUser) {
    super();
  }
}
