import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignupCommand } from './signup.command';
import { User, UserRole } from '../../../../domain/user/user.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import * as bcrypt from 'bcrypt';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueType } from '../../../../infrastructure/queue/queue-type.enum';
import { VerifyEmailJobDto } from '../../../../infrastructure/queue/email/dtos/verify-email-job.dto';
import { EmailJobType } from '../../../../infrastructure/queue/email/email-job.type.enum';
import { Queue } from 'bullmq';
import { authEmailJobOption } from '../../../../infrastructure/queue/email/auth-email-job.option';
import { AuthError } from '../../auth.error';
import { Logger } from '@nestjs/common';
import { EmailVerificationToken } from '../../../../domain/auth/email-verification-token.entity';
import * as crypto from 'crypto';

@CommandHandler(SignupCommand)
export class SignupHandler implements ICommandHandler<SignupCommand> {
  private readonly logger = new Logger(SignupHandler.name);

  public constructor(
    private readonly em: EntityManager,
    @InjectQueue(QueueType.EMAIL)
    private readonly emailQueue: Queue,
  ) {}

  public async execute(
    command: SignupCommand,
  ): Promise<Result<void, ResultError>> {
    const { email, userName, password, role } = command.user;

    if (await this.checkEmailExists(email)) {
      return Result.failure(AuthError.EmailAlreadyExists);
    }

    const user = await this.createUser(userName, email, role, password);
    const emailVerification = await this.createEmailVerification(user);

    await this.em.flush();
    await this.queueVerificationEmail(user, emailVerification.token);

    this.logger.log(
      { userId: user.id },
      'auth.signup.success: Registered new user',
    );

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

    const user = new User(
      fullName,
      email,
      UserRole[role.toUpperCase()],
      hashedPassword,
    );
    this.em.create(User, user);

    return user;
  }

  private async createEmailVerification(
    user: User,
  ): Promise<EmailVerificationToken> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    return this.em.create(EmailVerificationToken, {
      user,
      token,
      expiresAt,
    });
  }

  private async queueVerificationEmail(
    user: User,
    verificationToken: string,
  ): Promise<void> {
    const verifyEmailJob = new VerifyEmailJobDto(user, verificationToken);

    await this.emailQueue.add(
      EmailJobType.VERIFY_EMAIL,
      verifyEmailJob,
      authEmailJobOption,
    );
  }
}
