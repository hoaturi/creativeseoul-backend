import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from './sign-up.command';
import { User, UserRole } from '../../../../domain/user/user.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import * as bcrypt from 'bcrypt';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueType } from '../../../../infrastructure/queue/queue-type.enum';
import { VerifyEmailJob } from '../../../../infrastructure/queue/email/email-job.interface';
import { EmailJobType } from '../../../../infrastructure/queue/email/email-job.type.enum';
import { Queue } from 'bullmq';
import { authEmailOption } from '../../../../infrastructure/queue/email/auth-email.option';
import { EmailVerification } from '../../../../domain/auth/email-verification.entity';
import { AuthError } from '../../auth.error';

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    private readonly em: EntityManager,
    @InjectQueue(QueueType.EMAIL)
    private readonly emailQueue: Queue,
  ) {}

  async execute(command: SignUpCommand): Promise<Result<void, ResultError>> {
    const { email, fullName, password, role } = command.user;

    if (await this.checkEmailExists(email)) {
      return Result.failure(AuthError.EmailAlreadyExists);
    }

    const user = await this.createUser(fullName, email, role, password);
    const emailVerification = await this.createEmailVerification(user);

    await this.em.flush();
    await this.queueVerificationEmail(user, emailVerification.token);

    return Result.success();
  }

  private async checkEmailExists(email: string): Promise<boolean> {
    const exists = await this.em.findOne(User, { email }, { fields: ['id'] });
    return !!exists;
  }

  private async createUser(
    fullName: string,
    email: string,
    role: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(fullName, email, UserRole[role], hashedPassword);
    this.em.create(User, user);
    return user;
  }

  private async createEmailVerification(
    user: User,
  ): Promise<EmailVerification> {
    const token = crypto.randomUUID();
    const tokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const emailVerification = new EmailVerification(
      user,
      token,
      tokenExpiresAt,
    );
    this.em.create(EmailVerification, emailVerification);
    return emailVerification;
  }

  private async queueVerificationEmail(
    user: User,
    verificationToken: string,
  ): Promise<void> {
    const verifyEmailJob: VerifyEmailJob = {
      email: user.email,
      fullName: user.fullName,
      verificationToken,
    };

    await this.emailQueue.add(
      EmailJobType.VERIFY_EMAIL,
      verifyEmailJob,
      authEmailOption,
    );
  }
}
