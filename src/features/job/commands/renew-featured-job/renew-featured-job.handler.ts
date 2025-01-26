import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RenewFeaturedJobCommand } from './renew-featured-job.command';
import { EntityManager, Transactional } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Job } from '../../../../domain/job/entities/job.entity';
import { JobError } from '../../job.error';
import { UserRole } from '../../../../domain/user/user-role.enum';
import { CompanyError } from '../../../company/company.error';
import {
  CreditTransaction,
  CreditTransactionType,
} from '../../../../domain/company/entities/credit-transaction.entity';
import { Company } from '../../../../domain/company/entities/company.entity';

@CommandHandler(RenewFeaturedJobCommand)
export class RenewFeaturedJobHandler
  implements ICommandHandler<RenewFeaturedJobCommand>
{
  public constructor(private readonly em: EntityManager) {}

  @Transactional()
  public async execute(
    command: RenewFeaturedJobCommand,
  ): Promise<Result<void, ResultError>> {
    const { user, id } = command;

    const job = await this.em.findOne(
      Job,
      { id },
      {
        fields: ['isFeatured', 'company.id', 'company.creditBalance'],
      },
    );

    if (!job) {
      return Result.failure(JobError.NotFound);
    }

    if (job.isFeatured) {
      return Result.failure(JobError.AlreadyFeatured);
    }

    const isOwner = job.company.id === user.profile.id;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      return Result.failure(JobError.PermissionDenied);
    }

    if (job.company.creditBalance < 1) {
      return Result.failure(CompanyError.InsufficientCreditBalance);
    }

    job.company.creditBalance -= 1;

    // Bypass onUpdate lifecycle hook
    await this.em.nativeUpdate(
      Job,
      { id },
      { isFeatured: true, updatedAt: new Date() },
    );

    const transaction = new CreditTransaction({
      job: job as Job,
      company: job.company as Company,
      amount: -1,
      type: CreditTransactionType.USAGE,
    });

    this.em.persist(transaction);

    return Result.success();
  }
}
