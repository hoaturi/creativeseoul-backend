import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetJobListQuery } from './get-job-list.query';
import { EntityManager, Loaded, QBFilterQuery } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import {
  GetJobListItemCompanyDto,
  GetJobListItemDto,
  GetJobListResponseDto,
} from '../../dtos/responses/get-job-list-response.dto';
import { GetJobListQueryDto } from '../../dtos/requests/get-job-list-query.dto';
import { Job } from '../../../../domain/job/entities/job.entity';

const JOB_FIELDS = [
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
] as const;

type JobFields = (typeof JOB_FIELDS)[number];
type LoadedJob = Loaded<Job, never, JobFields>;

@QueryHandler(GetJobListQuery)
export class GetJobListHandler implements IQueryHandler<GetJobListQuery> {
  private readonly PAGE_SIZE = 20;

  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetJobListQuery,
  ): Promise<Result<GetJobListResponseDto, ResultError>> {
    const { page = 1 } = query.dto;

    const where: QBFilterQuery<Job> = {
      isPublished: true,
    };

    this.applyFilters(where, query.dto);

    const [jobs, count] = await this.em.findAndCount(Job, where, {
      fields: JOB_FIELDS,
      orderBy: {
        isFeatured: 'DESC',
        createdAt: 'DESC',
      },
      limit: this.PAGE_SIZE,
      offset: this.PAGE_SIZE * (page - 1),
    });

    const jobDtos = this.mpaToJobDtos(jobs);

    const response = new GetJobListResponseDto(jobDtos, count);

    return Result.success(response);
  }

  private mpaToJobDtos(jobs: LoadedJob[]): GetJobListItemDto[] {
    return jobs.map((job) => {
      const company = new GetJobListItemCompanyDto({
        id: job.company.id,
        name: job.company.name,
        logoUrl: job.company.logoUrl,
      });

      return new GetJobListItemDto({
        slug: job.slug,
        title: job.title,
        category: job.category.label,
        employmentType: job.employmentType.label,
        seniorityLevel: job.seniorityLevel.label,
        workLocationType: job.workLocationType.label,
        location: job.location,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        tags: job.tags,
        koreanLevel: job.koreanLevel.label,
        residentOnly: job.residentOnly,
        isFeatured: job.isFeatured,
        company,
      });
    });
  }

  private applyFilters(
    where: QBFilterQuery<Job>,
    dto: GetJobListQueryDto,
  ): void {
    const {
      search,
      categoryIds,
      seniorityLevelIds,
      employmentTypeIds,
      workLocationTypeIds,
      koreanLevelIds,
      residentOnly,
    } = dto;

    if (search) {
      const formattedSearch = search
        .split(' ')
        .map((word) => word.trim())
        .join(' & ');
      where.searchVector = { $fulltext: formattedSearch };
    }

    if (categoryIds?.length) {
      where.category = { id: { $in: categoryIds } };
    }

    if (seniorityLevelIds?.length) {
      where.seniorityLevel = { id: { $in: seniorityLevelIds } };
    }

    if (employmentTypeIds?.length) {
      where.employmentType = { id: { $in: employmentTypeIds } };
    }

    if (workLocationTypeIds?.length) {
      where.workLocationType = { id: { $in: workLocationTypeIds } };
    }

    if (koreanLevelIds?.length) {
      where.koreanLevel = { id: { $in: koreanLevelIds } };
    }

    if (residentOnly) {
      where.residentOnly = true;
    }
  }
}
