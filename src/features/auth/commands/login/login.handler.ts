import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import * as bcrypt from 'bcrypt';
import { LoginCommand } from './login.command';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { User } from '../../../../domain/user/user.entity';
import { AuthError } from '../../auth.error';
import { SessionResponseDto } from '../../dtos/session-response.dto';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  private readonly logger = new Logger(LoginHandler.name);

  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: LoginCommand,
  ): Promise<Result<SessionResponseDto, ResultError>> {
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
          'talent.fullName',
          'talent.avatarUrl',
          'company.id',
          'company.name',
          'company.logoUrl',
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

    this.logger.log(
      { userId: user.id },
      'auth.login.success: User authenticated',
    );

    return Result.success(
      new SessionResponseDto({
        id: user.id,
        role: user.role,
        profile: {
          id: user.talent?.id ?? user.company?.id,
          name: user.talent?.fullName ?? user.company?.name,
          avatarUrl: user.talent?.avatarUrl ?? user.company?.logoUrl,
        },
      }),
    );
  }
}
