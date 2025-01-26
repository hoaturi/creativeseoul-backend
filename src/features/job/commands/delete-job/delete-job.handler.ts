import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteJobCommand } from './delete-job.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Job } from '../../../../domain/job/entities/job.entity';
import { JobError } from '../../job.error';
import { UserRole } from '../../../../domain/user/user-role.enum';

@CommandHandler(DeleteJobCommand)
export class DeleteJobHandler implements ICommandHandler<DeleteJobCommand> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: DeleteJobCommand,
  ): Promise<Result<void, ResultError>> {
    const { user, id } = command;
    const job = await this.em.findOne(Job, id, {
      fields: ['company.id'],
    });

    if (!job) {
      return Result.failure(JobError.NotFound);
    }

    const isOwner = job.company.id === user.profile.id;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      return Result.failure(JobError.PermissionDenied);
    }

    this.em.remove(job);
    await this.em.flush();

    return Result.success();
  }
}
