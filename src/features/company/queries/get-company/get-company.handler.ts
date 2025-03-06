import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityManager, Loaded, LoadedCollection } from '@mikro-orm/postgresql';
import { GetCompanyQuery } from './get-company.query';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { Company } from '../../../../domain/company/entities/company.entity';
import { CompanyError } from '../../company.error';
import {
  CompanyJobItemDto,
  GetCompanyResponseDto,
} from '../../dtos/responses/get-company-response.dto';
import { Job } from '../../../../domain/job/entities/job.entity';

const COMPANY_FIELDS = [
  'name',
  'slug',
  'summary',
  'description',
  'logoUrl',
  'websiteUrl',
  'location',
  'size.label',
  'socialLinks',
  'jobs.slug',
  'jobs.title',
  'jobs.location',
  'jobs.category.label',
  'jobs.employmentType.label',
  'jobs.workLocationType.label',
  'jobs.experienceLevel.label',
  'jobs.minSalary',
  'jobs.maxSalary',
  'jobs.koreanLevel.label',
  'jobs.residentOnly',
  'jobs.isFeatured',
] as const;

type CompanyFields = (typeof COMPANY_FIELDS)[number];
type JobFields =
  Extract<CompanyFields, `jobs.${string}`> extends `jobs.${infer Field}`
    ? Field
    : never;

type LoadedJobs = LoadedCollection<Loaded<Job, never, JobFields>>;

@QueryHandler(GetCompanyQuery)
export class GetCompanyHandler implements IQueryHandler<GetCompanyQuery> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetCompanyQuery,
  ): Promise<Result<GetCompanyResponseDto, ResultError>> {
    const company = await this.em.findOne(
      Company,
      { slug: query.slug, isActive: true },
      {
        fields: COMPANY_FIELDS,
      },
    );

    if (!company) {
      return Result.failure(CompanyError.ProfileNotFound);
    }

    const responseDto = new GetCompanyResponseDto({
      name: company.name,
      summary: company.summary!,
      description: company.description!,
      logoUrl: company.logoUrl,
      websiteUrl: company.websiteUrl,
      location: company.location!,
      size: company.size.label,
      socialLinks: company.socialLinks,
      jobs: this.mapJobs(company.jobs),
    });

    return Result.success(responseDto);
  }

  private mapJobs(jobs: LoadedJobs): CompanyJobItemDto[] {
    return jobs
      .getItems()
      .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
      .map((job) => {
        return new CompanyJobItemDto({
          slug: job.slug,
          title: job.title,
          location: job.location,
          category: job.category.label,
          employmentType: job.employmentType.label,
          workLocationType: job.workLocationType.label,
          experienceLevel: job.experienceLevel.label,
          minSalary: job.minSalary,
          maxSalary: job.maxSalary,
          koreanLevel: job.koreanLevel.label,
          residentOnly: job.residentOnly,
          isFeatured: job.isFeatured,
        });
      });
  }
}
