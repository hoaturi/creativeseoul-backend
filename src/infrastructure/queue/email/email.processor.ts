import { Processor } from '@nestjs/bullmq';
import { QueueType } from '../queue-type.enum';
import { Job } from 'bullmq';
import { EmailJobType } from './email-job.type.enum';
import { EmailService } from '../../services/email/email.service';
import { VerifyEmailJob } from './email-job.interface';
import { BaseProcessor } from '../base.processor';

@Processor(QueueType.EMAIL)
export class EmailProcessor extends BaseProcessor {
  constructor(private readonly emailService: EmailService) {
    super(EmailProcessor.name);
  }

  process(job: Job): Promise<void> {
    switch (job.name) {
      case EmailJobType.VERIFY_EMAIL:
        return this.verifyEmail(job);
      default:
        new Error(`Job type ${job.name} not supported`);
    }
  }

  private async verifyEmail(job: Job<VerifyEmailJob>): Promise<void> {
    await this.emailService.sendVerificationEmail(job.data);
  }
}
