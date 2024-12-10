import { CommandHandler } from '@nestjs/cqrs';
import { ChangeUsernameCommand } from './change-username.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../../../../domain/user/user.entity';
import { Logger } from '@nestjs/common';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';

@CommandHandler(ChangeUsernameCommand)
export class ChangeUsernameHandler {
  private readonly logger = new Logger(ChangeUsernameHandler.name);
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: ChangeUsernameCommand,
  ): Promise<Result<void, ResultError>> {
    const { userId, userName } = command;

    const user = await this.em.findOneOrFail(
      User,
      { id: userId },
      { fields: ['username'] },
    );

    user.username = userName;

    await this.em.flush();

    this.logger.log(
      { userId: userId },
      'user.change-username.success: Username changed',
    );
    return Result.success();
  }
}
