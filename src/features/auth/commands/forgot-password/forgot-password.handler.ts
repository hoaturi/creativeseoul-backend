import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForgotPasswordCommand } from './forgot-password.command';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../../../../domain/user/user.entity';
import { Queue } from 'bullmq';
import { QueueType } from '../../../../infrastructure/queues/queue-type.enum';
import { EmailJobType } from '../../../../infrastructure/queues/email-queue/email-queue.type.enum';
import * as crypto from 'crypto';
import { ForgotPasswordToken } from '../../../../domain/auth/forgot-password-token.entity';
import { emailJobOption } from '../../../../infrastructure/queues/email-queue/processor/email-job.option';
import { ForgotPasswordJobDto } from '../../../../infrastructure/queues/email-queue/dtos/forgot-password-job.dto';
import { InjectQueue } from '@nestjs/bullmq';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler
  implements ICommandHandler<ForgotPasswordCommand>
{
  public constructor(
    private readonly em: EntityManager,
    @InjectQueue(QueueType.EMAIL)
    private readonly emailQueue: Queue,
  ) {}

  public async execute(
    command: ForgotPasswordCommand,
  ): Promise<Result<void, ResultError>> {
    const user = await this.em.findOne(User, { email: command.dto.email });

    if (!user) {
      return Result.success();
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const resetToken = new ForgotPasswordToken(user, token, expiresAt);
    await this.em.persistAndFlush(resetToken);

    const resetEmailJob = new ForgotPasswordJobDto(user.id, user.email, token);
    await this.emailQueue.add(
      EmailJobType.FORGOT_PASSWORD,
      resetEmailJob,
      emailJobOption,
    );

    return Result.success();
  }
}
