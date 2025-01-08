import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import * as bcrypt from 'bcrypt';
import { LoginCommand } from './login.command';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { User } from '../../../../domain/user/user.entity';
import { AuthError } from '../../auth.error';
import { LoginCommandResult } from './login-command.result';
import { UserRole } from '../../../../domain/user/user-role.enum';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  private readonly logger = new Logger(LoginHandler.name);

  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: LoginCommand,
  ): Promise<Result<LoginCommandResult, ResultError>> {
    const { email, password } = command.dto;

    const user = await this.em.findOne(
      User,
      { email },
      {
        fields: [
          'id',
          'password',
          'role',
          'isVerified',
          'talent.id',
          'company.id',
        ],
      },
    );

    if (!user) {
      return Result.failure(AuthError.InvalidCredentials);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.log(
        { userId: user.id },
        'auth.login.failed: Invalid password',
      );
      return Result.failure(AuthError.InvalidCredentials);
    }

    if (!user.isVerified) {
      return Result.failure(AuthError.EmailNotVerified);
    }

    let profileId: string;

    switch (user.role) {
      case UserRole.TALENT:
        profileId = user.talent.id;
        break;
      case UserRole.COMPANY:
        profileId = user.company.id;
        break;
    }

    this.logger.log(
      { userId: user.id },
      'auth.login.success: User authenticated',
    );

    return Result.success(
      new LoginCommandResult({
        id: user.id,
        role: user.role,
        profileId,
      }),
    );
  }
}
