import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from './verify-email.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { AuthError } from '../../auth.error';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { EmailVerification } from '../../../../domain/auth/email-verification.entity';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(private readonly em: EntityManager) {}

  async execute(
    command: VerifyEmailCommand,
  ): Promise<Result<void, ResultError>> {
    const { token } = command.dto;

    const verification = await this.em.findOne(
      EmailVerification,
      {
        token,
        usedAt: null,
        expiresAt: { $gt: new Date() },
      },
      {
        fields: ['usedAt', 'user.isVerified'],
      },
    );

    if (!verification || verification.user.isVerified) {
      return Result.failure(AuthError.InvalidToken);
    }

    verification.usedAt = new Date();
    verification.user.isVerified = true;

    await this.em.flush();
    return Result.success();
  }
}
