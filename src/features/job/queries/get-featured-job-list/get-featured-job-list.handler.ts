import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFeaturedJobListQuery } from './get-featured-job-list.query';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import {
  GetJobListItemCompanyDto,
  GetJobListItemDto,
  GetJobListResponseDto,
} from '../../dtos/responses/get-job-list-response.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Job } from '../../../../domain/job/entities/job.entity';

@QueryHandler(GetFeaturedJobListQuery)
export class GetFeaturedJobListHandler
  implements IQueryHandler<GetFeaturedJobListQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    _: GetFeaturedJobListQuery,
  ): Promise<Result<GetJobListResponseDto, ResultError>> {
    const [jobs, total] = await this.em.findAndCount(
      Job,
      {
        isPublished: true,
        isFeatured: true,
      },
      {
        fields: [
          'slug',
          'title',
          'description',
          'category.label',
          'employmentType.label',
          'seniorityLevel.label',
          'workLocationType.label',
          'location',
          'minSalary',
          'maxSalary',
          'tags',
          'koreanLevel.label',
          'residentOnly',
          'isFeatured',
          'company.id',
          'company.name',
          'company.logoUrl',
        ],
        orderBy: {
          createdAt: 'DESC',
        },
      },
    );

    const jobItemDtos = jobs.map(
      (jobs) =>
        new GetJobListItemDto({
          slug: jobs.slug,
          title: jobs.title,
          category: jobs.category.label,
          employmentType: jobs.employmentType.label,
          seniorityLevel: jobs.seniorityLevel.label,
          workLocationType: jobs.workLocationType.label,
          location: jobs.location,
          minSalary: jobs.minSalary,
          maxSalary: jobs.maxSalary,
          tags: jobs.tags,
          koreanLevel: jobs.koreanLevel.label,
          residentOnly: jobs.residentOnly,
          isFeatured: jobs.isFeatured,
          company: new GetJobListItemCompanyDto({
            id: jobs.company.id,
            name: jobs.company.name,
            logoUrl: jobs.company.logoUrl,
          }),
        }),
    );

    return Result.success(new GetJobListResponseDto(jobItemDtos, total));
  }
}
