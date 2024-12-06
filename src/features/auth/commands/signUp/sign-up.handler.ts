import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from './sign-up.command';
import { User, UserRole } from '../../../../domain/user/user.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { UserErrors } from '../../../user/errors/user.errors';
import * as bcrypt from 'bcrypt';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueType } from '../../../../infrastructure/queue/queue-type.enum';
import { VerifyEmailJob } from '../../../../infrastructure/queue/email/email-job.interface';
import { EmailJobType } from '../../../../infrastructure/queue/email/email-job.type.enum';
import { Queue } from 'bullmq';
import { authEmailOption } from '../../../../infrastructure/queue/email/auth-email.option';

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    private readonly em: EntityManager,
    @InjectQueue(QueueType.EMAIL)
    private readonly emailQueue: Queue,
  ) {}

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

    const password = await bcrypt.hash(command.user.password, 10);
    const verificationToken = crypto.randomUUID();
    const verificationTokenExpiresAt = new Date(Date.now() + 60 * 30 * 1000);

    const user = new User(
      command.user.fullName,
      command.user.email,
      UserRole[command.user.role],
      password,
      verificationToken,
      verificationTokenExpiresAt,
    );

    this.em.create(User, user);
    await this.em.flush();

    const verifyEmailJob: VerifyEmailJob = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      verificationToken: user.verificationToken,
    };

    await this.emailQueue.add(
      EmailJobType.VERIFY_EMAIL,
      verifyEmailJob,
      authEmailOption,
    );

    return Result.success();
  }
}
