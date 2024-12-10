import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangePasswordCommand } from './change-password.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { User } from '../../../../domain/user/user.entity';
import * as bcrypt from 'bcrypt';
import { UserError } from '../../user.error';
import { Logger } from '@nestjs/common';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler
  implements ICommandHandler<ChangePasswordCommand>
{
  private readonly logger = new Logger(ChangePasswordHandler.name);

  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: ChangePasswordCommand,
  ): Promise<Result<void, ResultError>> {
    const { currentPassword, newPassword, userId } = command;

    const user = await this.em.findOneOrFail(
      User,
      { id: userId },
      { fields: ['password'] },
    );

    const isCorrectPassword = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCorrectPassword) {
      return Result.failure(UserError.CurrentPasswordMismatch);
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await this.em.flush();

    this.logger.log(
      { userId: userId },
      'user.change-password.success: Password changed',
    );

    return Result.success();
  }
}
