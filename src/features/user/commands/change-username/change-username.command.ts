import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';

export class ChangeUsernameCommand extends Command<Result<void, ResultError>> {
  public constructor(
    public readonly userId: string,
    public readonly userName: string,
  ) {
    super();
  }
}
