import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAccountCommand } from './delete-account.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { User } from '../../../../domain/user/user.entity';
import { UserError } from '../../user.error';

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountHandler
  implements ICommandHandler<DeleteAccountCommand>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: DeleteAccountCommand,
  ): Promise<Result<void, ResultError>> {
    const user = await this.em.findOne(
      User,
      { id: command.user.id },
      {
        fields: ['id'],
      },
    );

    if (!user) {
      return Result.failure(UserError.NotFound);
    }

    await this.em.removeAndFlush(user);

    return Result.success();
  }
}
