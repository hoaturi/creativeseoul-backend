import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRegularJobListQuery } from './get-regular-job-list.query';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import {
  GetJobListItemCompanyDto,
  GetJobListItemDto,
  GetJobListResponseDto,
} from '../../dtos/responses/get-job-list-response.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Job } from '../../../../domain/job/entities/job.entity';

@QueryHandler(GetRegularJobListQuery)
export class GetRegularJobListHandler
  implements IQueryHandler<GetRegularJobListQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    _: GetRegularJobListQuery,
  ): Promise<Result<GetJobListResponseDto, ResultError>> {
    const [jobs, total] = await Promise.all([
      this.em.find(
        Job,
        {
          isPublished: true,
          isFeatured: false,
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
          limit: 10,
          orderBy: {
            createdAt: 'DESC',
          },
        },
      ),
      this.em.count(Job, { isPublished: true }),
    ]);

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
