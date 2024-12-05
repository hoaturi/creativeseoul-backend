import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from './sign-up.command';
import { User, UserRole } from '../../../../domain/user/user.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { UserErrors } from '../../../user/errors/user.errors';
import * as bcrypt from 'bcrypt';

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(private readonly em: EntityManager) {}

  async execute(command: SignUpCommand): Promise<Result<void, ResultError>> {
    const exists = await this.em.findOne(
      User,
      { email: command.user.email },
      {
        fields: ['id'],
      },
    );

    if (exists) {
      return Result.failure(UserErrors.EmailAlreadyExists);
    }

    const user = new User(
      command.user.fullName,
      command.user.email,
      UserRole[command.user.role],
    );

    user.password = await bcrypt.hash(command.user.password, 10);

    this.em.create(User, user);
    await this.em.flush();

    return Result.success();
  }
}
