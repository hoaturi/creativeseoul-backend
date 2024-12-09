import { Processor } from '@nestjs/bullmq';
import { QueueType } from '../queue-type.enum';
import { Job } from 'bullmq';
import { EmailJobType } from './email-job.type.enum';
import { EmailService } from '../../services/email/email.service';
import { VerifyEmailJobDto } from './dtos/verify-email-job.dto';
import { BaseProcessor } from '../base.processor';
import { ForgotPasswordJobDto } from './dtos/forgot-password-job.dto';

@Processor(QueueType.EMAIL)
export class EmailProcessor extends BaseProcessor {
  constructor(private readonly emailService: EmailService) {
    super(EmailProcessor.name);
  }

  process(job: Job): Promise<void> {
    switch (job.name) {
      case EmailJobType.VERIFY_EMAIL:
        return this.verifyEmail(job);

      case EmailJobType.FORGOT_PASSWORD:
        return this.forgotPassword(job);
      default:
        new Error(`Job type ${job.name} not supported`);
    }
  }

  private async verifyEmail(job: Job<VerifyEmailJobDto>): Promise<void> {
    await this.emailService.sendVerificationEmail(job.data);
  }

  private forgotPassword(job: Job<ForgotPasswordJobDto>): Promise<void> {
    return this.emailService.sendForgotPasswordEmail(job.data);
  }
}
