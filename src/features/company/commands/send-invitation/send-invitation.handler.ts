import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendInvitationCommand } from './send-invitation.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { Company } from '../../../../domain/company/company.entity';
import { CompanyInvitation } from '../../../../domain/company/company-invitation.entity';
import * as crypto from 'crypto';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueType } from '../../../../infrastructure/queue/queue-type.enum';
import { Queue } from 'bullmq';
import { EmailJobType } from '../../../../infrastructure/queue/email/email-job.type.enum';
import { emailJobOption } from '../../../../infrastructure/queue/email/email-job.option';
import { CompanyInvitationJobDto } from '../../../../infrastructure/queue/email/dtos/company-invitation-job.dto';
import { Logger } from '@nestjs/common';
import { CompanyError } from '../../company.error';

@CommandHandler(SendInvitationCommand)
export class SendInvitationHandler
  implements ICommandHandler<SendInvitationCommand>
{
  private readonly logger = new Logger(SendInvitationHandler.name);

  public constructor(
    private readonly em: EntityManager,
    @InjectQueue(QueueType.EMAIL)
    private readonly emailQueue: Queue,
  ) {}

  public async execute(
    command: SendInvitationCommand,
  ): Promise<Result<void, ResultError>> {
    const { dto } = command;

    let company = await this.em.findOne(
      Company,
      {
        websiteUrl: dto.websiteUrl,
      },
      {
        fields: ['id', 'isClaimed'],
      },
    );

    let isNewCompany = false;
    if (!company) {
      company = this.em.create(
        Company,
        new Company({
          isClaimed: false,
          name: dto.companyName,
          websiteUrl: dto.websiteUrl,
        }),
      );
      isNewCompany = true;
    } else if (company.isClaimed) {
      return Result.failure(CompanyError.ProfileAlreadyClaimed);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 2);

    this.em.create(
      CompanyInvitation,
      new CompanyInvitation(token, expiresAt, company as Company),
    );

    await this.em.flush();

    if (isNewCompany) {
      this.logger.log(
        { companyId: company.id },
        'company.send-invitation.success: New company created during invitation process',
      );
    }

    const invitationDto = new CompanyInvitationJobDto(
      company.id,
      dto.email,
      token,
    );

    await this.emailQueue.add(
      EmailJobType.COMPANY_INVITATION,
      invitationDto,
      emailJobOption,
    );

    return Result.success();
  }
}
