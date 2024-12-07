import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from './verify-email.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { AuthError } from '../../auth.error';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(private readonly em: EntityManager) {}

  async execute(
    command: VerifyEmailCommand,
  ): Promise<Result<void, ResultError>> {
    const { token } = command.dto;

    const result = await this.em.execute(
      `
          WITH updated_verification AS (
            UPDATE email_verification ev
              SET used_at = NOW()
              FROM "user" u
              WHERE ev.token = ?
                AND ev.expires_at > NOW()
                AND ev.used_at IS NULL
                AND ev.user_id = u.id
                AND u.is_verified = FALSE
              RETURNING ev.user_id
          )
          UPDATE "user" u
          SET is_verified = TRUE
          FROM updated_verification uv
          WHERE u.id = uv.user_id
          RETURNING u.id
        `,
      [token],
    );

    if (result.length === 0) {
      return Result.failure(AuthError.InvalidToken);
    }

    return Result.success();
  }
}
