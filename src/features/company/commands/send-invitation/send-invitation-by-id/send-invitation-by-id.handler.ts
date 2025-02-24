import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendInvitationByIdCommand } from './send-invitation-by-id.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../../common/result/result';
import { ResultError } from '../../../../../common/result/result-error';
import { Company } from '../../../../../domain/company/entities/company.entity';
import { CompanyError } from '../../../company.error';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueType } from '../../../../../infrastructure/queues/queue-type.enum';
import { Queue } from 'bullmq';
import * as crypto from 'crypto';
import { CompanyInvitation } from '../../../../../domain/company/entities/company-invitation.entity';
import { CompanyInvitationJobDto } from '../../../../../infrastructure/queues/email-queue/dtos/company-invitation-job.dto';
import { EmailJobType } from '../../../../../infrastructure/queues/email-queue/email-queue.type.enum';
import { emailJobOption } from '../../../../../infrastructure/queues/email-queue/processor/email-job.option';

@CommandHandler(SendInvitationByIdCommand)
export class SendInvitationByIdHandler
  implements ICommandHandler<SendInvitationByIdCommand>
{
  public constructor(
    private readonly em: EntityManager,
    @InjectQueue(QueueType.EMAIL)
    private readonly emailQueue: Queue,
  ) {}

  public async execute(
    command: SendInvitationByIdCommand,
  ): Promise<Result<void, ResultError>> {
    const { id, dto } = command;

    const company = await this.em.findOne(
      Company,
      { id },
      {
        fields: ['id', 'isClaimed'],
      },
    );

    if (!company) {
      return Result.failure(CompanyError.ProfileNotFound);
    }

    if (company.isClaimed) {
      return Result.failure(CompanyError.ProfileAlreadyClaimed);
    }

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
