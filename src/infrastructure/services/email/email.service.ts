import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { SendTemplatedEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { applicationConfig } from '../../../config/application.config';
import { VerifyEmailJob } from '../../queue/email/email-job.interface';
import { EmailJobType } from '../../queue/email/email-job.type.enum';
import {
  BaseTemplateData,
  VerifyEmailTemplateData,
} from './templates/template-data.interface';

interface EmailPayload {
  template: EmailJobType;
  templateData: BaseTemplateData;
}

@Injectable()
export class EmailService {
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

  async sendEmail(email: string, config: EmailPayload): Promise<void> {
    const { template, templateData } = config;

    const emailCommand = new SendTemplatedEmailCommand({
      Destination: {
        ToAddresses: [email],
      },
      Template: template,
      TemplateData: JSON.stringify(templateData),
      Source: this.appConfig.email.from,
    });

    await this.sesClient.send(emailCommand);
  }

  async sendVerificationEmail(payload: VerifyEmailJob): Promise<void> {
    const templateData: VerifyEmailTemplateData = {
      fullName: payload.fullName,
      verificationLink: `${this.appConfig.client.baseUrl}?token=${payload.verificationToken}`,
    };

    await this.sendEmail(payload.email, {
      template: EmailJobType.VERIFY_EMAIL,
      templateData,
    });
  }
}
