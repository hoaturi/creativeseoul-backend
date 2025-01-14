import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordCommand } from './reset-password.command';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { ForgotPasswordToken } from '../../../../domain/auth/forgot-password-token.entity';
import { AuthError } from '../../auth.error';
import * as bcrypt from 'bcrypt';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  private readonly logger = new Logger(ResetPasswordHandler.name);

  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: ResetPasswordCommand,
  ): Promise<Result<void, ResultError>> {
    const { token, password } = command;

    const resetToken = await this.em.findOne(
      ForgotPasswordToken,
      {
        token,
        usedAt: null,
        expiresAt: { $gt: new Date() },
      },
      {
        fields: ['id', 'usedAt', 'user.password'],
      },
    );

    if (!resetToken) {
      this.logger.log(
        { token },
        'auth.reset-password.failed: Invalid or expired token',
      );
      return Result.failure(AuthError.InvalidToken);
    }

    resetToken.user.password = await bcrypt.hash(password, 10);
    resetToken.usedAt = new Date();

    await this.em.flush();
    await this.em.nativeDelete(ForgotPasswordToken, {
      id: {
        $ne: resetToken.id,
      },
      user: resetToken.user.id,
    });

    return Result.success();
  }
}
