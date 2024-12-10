import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';

export class ChangePasswordCommand extends Command<Result<void, ResultError>> {
  public readonly userId: string;
  public readonly currentPassword: string;
  public readonly newPassword: string;

  public constructor(
    userId: string,
    passwords: { currentPassword: string; newPassword: string },
  ) {
    super();
    this.userId = userId;
    this.currentPassword = passwords.currentPassword;
    this.newPassword = passwords.newPassword;
  }
}
