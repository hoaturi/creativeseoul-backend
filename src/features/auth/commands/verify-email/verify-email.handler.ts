import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from './verify-email.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { AuthError } from '../../auth.error';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { EmailVerificationToken } from '../../../../domain/auth/email-verification-token.entity';
import { Logger } from '@nestjs/common';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  private readonly logger = new Logger(VerifyEmailHandler.name);

  constructor(private readonly em: EntityManager) {}

  async execute(
    command: VerifyEmailCommand,
  ): Promise<Result<void, ResultError>> {
    const { token } = command.dto;

    const verification = await this.em.findOne(
      EmailVerificationToken,
      {
        token,
        usedAt: null,
        expiresAt: { $gt: new Date() },
      },
      {
        fields: ['usedAt', 'user.isVerified', 'user.id'],
      },
    );

    if (!verification || verification.user.isVerified) {
      this.logger.log(
        { token, userId: verification?.user.id },
        'auth.verify-email.failed: Invalid or expired token',
      );
      return Result.failure(AuthError.InvalidToken);
    }

    verification.usedAt = new Date();
    verification.user.isVerified = true;

    await this.em.flush();

    await this.em.nativeDelete(EmailVerificationToken, {
      id: { $ne: verification.id },
      user: verification.user.id,
    });

    this.logger.log(
      { userId: verification.user.id },
      'auth.verify-email.success: Email verified',
    );

    return Result.success();
  }
}
