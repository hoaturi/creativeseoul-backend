import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishJobCommand } from './publish-job.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Job } from '../../../../domain/job/entities/job.entity';
import { JobError } from '../../job.error';
import { UserRole } from '../../../../domain/user/user-role.enum';

@CommandHandler(PublishJobCommand)
export class PublishJobHandler implements ICommandHandler<PublishJobCommand> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: PublishJobCommand,
  ): Promise<Result<void, ResultError>> {
    const { user, id } = command;

    const job = await this.em.findOne(
      Job,
      { id },
      {
        fields: ['isPublished', 'company.id'],
      },
    );

    if (!job) {
      return Result.failure(JobError.NotFound);
    }

    if (job.isPublished) {
      return Result.failure(JobError.AlreadyPublished);
    }

    const isOwner = job.company.id === user.profileId;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      return Result.failure(JobError.PermissionDenied);
    }

    // Bypass onUpdate lifecycle hook
    await this.em.nativeUpdate(Job, { id }, { isPublished: true });

    return Result.success();
  }
}
