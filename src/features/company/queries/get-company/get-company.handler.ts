import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityManager, Loaded, LoadedCollection } from '@mikro-orm/postgresql';
import { GetCompanyQuery } from './get-company.query';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { Company } from '../../../../domain/company/company.entity';
import { CompanyError } from '../../company.error';
import {
  CompanyJobItemDto,
  CompanySocialLinksDto,
  GetCompanyResponseDto,
} from '../../dtos/responses/get-company-response.dto';
import { Job } from '../../../../domain/job/job.entity';

const COMPANY_FIELDS = [
  'name',
  'summary',
  'description',
  'logoUrl',
  'websiteUrl',
  'location',
  'size.label',
  'socialLinks',
  'jobs.id',
  'jobs.title',
  'jobs.location',
  'jobs.category',
  'jobs.employmentType.label',
  'jobs.minSalary',
  'jobs.maxSalary',
  'jobs.koreanLevel.label',
  'jobs.residentOnly',
  'jobs.tags',
  'jobs.isFeatured',
] as const;

type CompanyFields = (typeof COMPANY_FIELDS)[number];
type JobFields =
  Extract<CompanyFields, `jobs.${string}`> extends `jobs.${infer Field}`
    ? Field
    : never;

type LoadedCompany = Loaded<Company, never, CompanyFields>;
type LoadedJobs = LoadedCollection<Loaded<Job, never, JobFields>>;

@QueryHandler(GetCompanyQuery)
export class GetCompanyHandler implements IQueryHandler<GetCompanyQuery> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetCompanyQuery,
  ): Promise<Result<GetCompanyResponseDto, ResultError>> {
    const company = await this.em.findOne(
      Company,
      { id: query.id },
      {
        fields: COMPANY_FIELDS,
      },
    );

    if (!company) {
      return Result.failure(CompanyError.ProfileNotFound);
    }

    const responseDto = new GetCompanyResponseDto({
      ...this.mapBasicInfo(company),
      jobs: this.mapJobs(company.jobs),
    });

    return Result.success(responseDto);
  }

  private mapBasicInfo(company: LoadedCompany) {
    const size = company.size?.label;
    const socialLinks = company.socialLinks
      ? new CompanySocialLinksDto(company.socialLinks)
      : null;

    return {
      name: company.name,
      summary: company.summary,
      description: company.description,
      logoUrl: company.logoUrl,
      websiteUrl: company.websiteUrl,
      location: company.location,
      size,
      socialLinks,
    };
  }

  private mapJobs(jobs: LoadedJobs): CompanyJobItemDto[] {
    return jobs.getItems().map((job) => {
      return new CompanyJobItemDto({
        id: job.id,
        title: job.title,
        location: job.location,
        category: job.category.label,
        employmentType: job.employmentType.label,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        koreanLevel: job.koreanLevel.label,
        residentOnly: job.residentOnly,
        tags: job.tags,
        isFeatured: job.isFeatured,
      });
    });
  }
}
