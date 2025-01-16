import { Processor } from '@nestjs/bullmq';
import { QueueType } from '../../queue-type.enum';
import { Job } from 'bullmq';
import { EmailJobType } from '../email-queue.type.enum';
import { EmailService } from '../../../services/email/email.service';
import { VerifyEmailJobDto } from '../dtos/verify-email-job.dto';
import { BaseProcessor } from '../../base.processor';
import { ForgotPasswordJobDto } from '../dtos/forgot-password-job.dto';
import { CompanyInvitationJobDto } from '../dtos/company-invitation-job.dto';

@Processor(QueueType.EMAIL)
export class EmailProcessor extends BaseProcessor {
  public constructor(private readonly emailService: EmailService) {
    super(EmailProcessor.name);
  }

  public process(job: Job): Promise<void> {
    switch (job.name) {
      case EmailJobType.VERIFY_EMAIL:
        return this.verifyEmail(job);

      case EmailJobType.FORGOT_PASSWORD:
        return this.forgotPassword(job);

      case EmailJobType.COMPANY_INVITATION:
        return this.sendCompanyInvitation(job);
      default:
        throw new Error(`Job type ${job.name} not supported`);
    }
  }

  private async verifyEmail(job: Job<VerifyEmailJobDto>): Promise<void> {
    await this.emailService.sendEmailVerification(job.data);
  }

  private async forgotPassword(job: Job<ForgotPasswordJobDto>): Promise<void> {
    await this.emailService.sendForgotPassword(job.data);
  }

  private async sendCompanyInvitation(
    job: Job<CompanyInvitationJobDto>,
  ): Promise<void> {
    await this.emailService.sendCompanyInvitationEmail(job.data);
  }
}
