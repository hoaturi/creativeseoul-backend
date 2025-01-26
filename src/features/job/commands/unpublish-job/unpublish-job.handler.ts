import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnpublishJobCommand } from './unpublish-job.command';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Job } from '../../../../domain/job/entities/job.entity';
import { JobError } from '../../job.error';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserRole } from '../../../../domain/user/user-role.enum';

@CommandHandler(UnpublishJobCommand)
export class UnpublishJobHandler
  implements ICommandHandler<UnpublishJobCommand>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: UnpublishJobCommand,
  ): Promise<Result<void, ResultError>> {
    const { user, id } = command;

    const job = await this.em.findOne(Job, id, {
      fields: ['isPublished', 'company.id'],
    });

    if (!job) {
      return Result.failure(JobError.NotFound);
    }

    const isOwner = job.company.id === user.profile.id;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      return Result.failure(JobError.PermissionDenied);
    }

    // Bypass onUpdate lifecycle hook
    await this.em.nativeUpdate(
      Job,
      { id },
      { isPublished: false, updatedAt: new Date() },
    );

    return Result.success();
  }
}
