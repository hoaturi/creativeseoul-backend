import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMyJobListQuery } from './get-my-job-list.query';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import {
  GetMyJobListItemDto,
  GetMyJobListResponseDto,
} from '../../dtos/responses/get-my-job-list-response.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Job } from '../../../../domain/job/entities/job.entity';

@QueryHandler(GetMyJobListQuery)
export class GetMyJobListHandler implements IQueryHandler<GetMyJobListQuery> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetMyJobListQuery,
  ): Promise<Result<GetMyJobListResponseDto, ResultError>> {
    const { user } = query;

    if (!user.profile.id) {
      return Result.success(new GetMyJobListResponseDto([], 0));
    }

    const [jobs, total] = await this.em.findAndCount(
      Job,
      { company: user.profile.id },
      {
        fields: [
          'id',
          'slug',
          'title',
          'applicationClickCount',
          'isPublished',
          'isFeatured',
          'createdAt',
        ],
        orderBy: {
          createdAt: 'DESC',
        },
      },
    );

    const jobsDto = jobs.map(
      (job) =>
        new GetMyJobListItemDto({
          id: job.id,
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
