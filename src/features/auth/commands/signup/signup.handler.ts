import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignupCommand } from './signup.command';
import { User } from '../../../../domain/user/user.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import * as bcrypt from 'bcrypt';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueType } from '../../../../infrastructure/queues/queue-type.enum';
import { VerifyEmailJobDto } from '../../../../infrastructure/queues/email-queue/dtos/verify-email-job.dto';
import { EmailJobType } from '../../../../infrastructure/queues/email-queue/email-queue.type.enum';
import { Queue } from 'bullmq';
import { emailJobOption } from '../../../../infrastructure/queues/email-queue/processor/email-job.option';
import { AuthError } from '../../auth.error';
import { Logger } from '@nestjs/common';
import { EmailVerificationToken } from '../../../../domain/auth/email-verification-token.entity';
import * as crypto from 'crypto';
import { SignUpRequestDto } from '../../dtos';
import { UserRole } from '../../../../domain/user/user-role.enum';

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
    const { email } = command.dto;

    if (await this.checkEmailExists(email)) {
      return Result.failure(AuthError.EmailAlreadyExists);
    }

    const user = await this.createUser(command.dto);
    const emailVerification = await this.createEmailVerification(user);

    await this.em.flush();
    await this.queueVerificationEmail(user, emailVerification.token);

    this.logger.log(
      { userId: user.id },
      'auth.signup.success: User signed up successfully',
    );

    return Result.success();
  }

  private async checkEmailExists(email: string): Promise<boolean> {
    const exists = await this.em.findOne(User, { email }, { fields: ['id'] });
    return !!exists;
  }

  private async createUser(dto: SignUpRequestDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = new User(dto.email, hashedPassword, UserRole.TALENT);

    this.em.create(User, user);

    return user;
  }

  private async createEmailVerification(
    user: User,
  ): Promise<EmailVerificationToken> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    return this.em.create(
      EmailVerificationToken,
      new EmailVerificationToken(user, token, expiresAt),
    );
  }

  private async queueVerificationEmail(
    user: User,
    verificationToken: string,
  ): Promise<void> {
    const verifyEmailJob = new VerifyEmailJobDto(user, verificationToken);

    await this.emailQueue.add(
      EmailJobType.VERIFY_EMAIL,
      verifyEmailJob,
      emailJobOption,
    );
  }
}
