import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMyJobListQuery } from './get-my-job-list.query';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import {
  GetMyJobListItemDto,
  GetMyJobListResponseDto,
} from '../../dtos/get-my-job-list-response.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Job } from '../../../../domain/job/job.entity';

@QueryHandler(GetMyJobListQuery)
export class GetMyJobListHandler implements IQueryHandler<GetMyJobListQuery> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetMyJobListQuery,
  ): Promise<Result<GetMyJobListResponseDto, ResultError>> {
    const { user } = query;

    if (!user.profileId) {
      return Result.success(new GetMyJobListResponseDto([], 0));
    }

    const [jobs, total] = await this.em.findAndCount(
      Job,
      { company: user.profileId },
      {
        fields: [
          'slug',
          'title',
          'applicationClickCount',
          'isPublished',
          'isFeatured',
          'createdAt',
        ],
      },
    );

    const jobsDto = jobs.map(
      (job) =>
        new GetMyJobListItemDto({
          slug: job.slug,
          title: job.title,
          applicationClickCount: job.applicationClickCount,
          isPublished: job.isPublished,
          isFeatured: job.isFeatured,
          createdAt: job.createdAt,
        }),
    );

    const response = new GetMyJobListResponseDto(jobsDto, total);

    return Result.success(response);
  }
}
