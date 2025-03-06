import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendInvitationCommand } from './send-invitation.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { Company } from '../../../../domain/company/entities/company.entity';
import { CompanyInvitation } from '../../../../domain/company/entities/company-invitation.entity';
import * as crypto from 'crypto';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueType } from '../../../../infrastructure/queues/queue-type.enum';
import { Queue } from 'bullmq';
import { EmailJobType } from '../../../../infrastructure/queues/email-queue/email-queue.type.enum';
import { emailJobOption } from '../../../../infrastructure/queues/email-queue/processor/email-job.option';
import { CompanyInvitationJobDto } from '../../../../infrastructure/queues/email-queue/dtos/company-invitation-job.dto';
import { CompanySize } from '../../../../domain/company/entities/company-size.entity';
import slugify from 'slugify';
import { CompanyError } from '../../company.error';

@CommandHandler(SendInvitationCommand)
export class SendInvitationHandler
  implements ICommandHandler<SendInvitationCommand>
{
  public constructor(
    private readonly em: EntityManager,
    @InjectQueue(QueueType.EMAIL)
    private readonly emailQueue: Queue,
  ) {}

  public async execute(
    command: SendInvitationCommand,
  ): Promise<Result<void, ResultError>> {
    const { dto } = command;

    const size = this.em.getReference(CompanySize, dto.sizeId);
    const slug = slugify(dto.name, { lower: true });

    const nameExists = await this.em.count(Company, { slug });
    if (nameExists) {
      return Result.failure(CompanyError.ProfileAlreadyExists);
    }

    const websiteUrlExists = await this.em.count(Company, {
      websiteUrl: dto.websiteUrl,
    });
    if (websiteUrlExists) {
      return Result.failure(CompanyError.ProfileAlreadyExists);
    }

    const company = this.em.create(
      Company,
      new Company({
        isClaimed: false,
        isActive: false,
        name: dto.name,
        slug,
        size,
        location: dto.location,
        summary: dto.summary,
        description: dto.description,
        websiteUrl: dto.websiteUrl,
        socialLinks: dto.socialLinks || {},
        creditBalance: 0,
      }),
    );

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 2);

    this.em.create(
      CompanyInvitation,
      new CompanyInvitation(token, expiresAt, false, company as Company),
    );

    await this.em.flush();

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
