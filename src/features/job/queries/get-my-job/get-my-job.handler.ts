import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMyJobQuery } from './get-my-job.query';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import {
  GetJobResponseDto,
  JobCompanyDto,
} from '../../dtos/responses/get-job-response.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Job } from '../../../../domain/job/entities/job.entity';
import { JobError } from '../../job.error';

@QueryHandler(GetMyJobQuery)
export class GetMyJobHandler implements IQueryHandler<GetMyJobQuery> {
  public constructor(private em: EntityManager) {}

  public async execute(
    query: GetMyJobQuery,
  ): Promise<Result<GetJobResponseDto, ResultError>> {
    const job = await this.em.findOne(
      Job,
      {
        company: query.user.profile.id,
        slug: query.slug,
      },
      {
        fields: [
          'id',
          'title',
          'description',
          'category.label',
          'employmentType.label',
          'experienceLevel.label',
          'workLocationType.label',
          'location',
          'minSalary',
          'maxSalary',
          'tags',
          'koreanLevel.label',
          'englishLevel.label',
          'residentOnly',
          'applicationUrl',
          'isPublished',
          'company.slug',
          'company.name',
          'company.description',
          'company.logoUrl',
          'company.size.label',
        ],
      },
    );

    if (!job) {
      return Result.failure(JobError.NotFound);
    }

    const companyDto = new JobCompanyDto({
      slug: job.company.slug,
      name: job.company.name,
      description: job.company.description!,
      logoUrl: job.company.logoUrl,
      size: job.company.size?.label,
    });

    const responseDto = new GetJobResponseDto({
      company: companyDto,
      id: job.id,
      title: job.title,
      description: job.description,
      category: job.category.label,
      employmentType: job.employmentType.label,
      experienceLevel: job.experienceLevel.label,
      workLocationType: job.workLocationType.label,
      location: job.location,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      tags: job.tags,
      koreanLevel: job.koreanLevel.label,
      englishLevel: job.englishLevel.label,
      residentOnly: job.residentOnly,
      applicationUrl: job.applicationUrl,
    });

    return Result.success(responseDto);
  }
}
