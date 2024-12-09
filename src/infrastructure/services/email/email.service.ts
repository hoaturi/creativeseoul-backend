import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { SendTemplatedEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { applicationConfig } from '../../../config/application.config';
import { VerifyEmailJobDto } from '../../queue/email/dtos/verify-email-job.dto';
import { EmailJobType } from '../../queue/email/email-job.type.enum';
import { Template } from './interfaces/template.interface';
import { VerificationTemplateData } from './interfaces';
import { ForgotPasswordJobDto } from '../../queue/email/dtos/forgot-password-job.dto';
import { ForgotPasswordTemplateData } from './interfaces/forgot-password-template-data.interface';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly sesClient: SESClient;

  constructor(
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {
    this.sesClient = new SESClient({
      region: appConfig.aws.region,
      credentials: {
        accessKeyId: appConfig.aws.accessKeyId,
        secretAccessKey: appConfig.aws.secretAccessKey,
      },
    });
  }

  async sendEmail(email: string, template: Template): Promise<void> {
    const { templateType, templateData } = template;

    const emailCommand = new SendTemplatedEmailCommand({
      Destination: {
        ToAddresses: [email],
      },
      Template: templateType,
      TemplateData: JSON.stringify(templateData),
      Source: this.appConfig.email.from,
    });

    await this.sesClient.send(emailCommand);
  }

  async sendVerificationEmail(payload: VerifyEmailJobDto): Promise<void> {
    const templateData: VerificationTemplateData = {
      fullName: payload.fullName,
      verificationLink: `${this.appConfig.client.baseUrl}?token=${payload.verificationToken}`,
    };

    await this.sendEmail(payload.email, {
      templateType: EmailJobType.VERIFY_EMAIL,
      templateData,
    });

    this.logger.log(
      { userId: payload.userId },
      'email.verification.success: Verification link sent',
    );
  }

  async sendForgotPasswordEmail(payload: ForgotPasswordJobDto): Promise<void> {
    const templateData: ForgotPasswordTemplateData = {
      email: payload.email,
      passwordResetLink: `${this.appConfig.client.baseUrl}/reset-password?token=${payload.token}`,
    };

    await this.sendEmail(payload.email, {
      templateType: EmailJobType.FORGOT_PASSWORD,
      templateData,
    });

    this.logger.log(
      { userId: payload.userId },
      'email.forgot-password.success: Forgot password link sent',
    );
  }
}
