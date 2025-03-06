import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetJobQuery } from './get-job.query';
import { EntityManager } from '@mikro-orm/core';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import {
  GetJobResponseDto,
  JobCompanyDto,
  RelatedJobDto,
} from '../../dtos/responses/get-job-response.dto';
import { Job } from '../../../../domain/job/entities/job.entity';
import { JobError } from '../../job.error';

@QueryHandler(GetJobQuery)
export class GetJobHandler implements IQueryHandler<GetJobQuery> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetJobQuery,
  ): Promise<Result<GetJobResponseDto, ResultError>> {
    const job = await this.em.findOne(
      Job,
      {
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

    const relatedJobs = await this.em.find(
      Job,
      {
        company: job.company,
        isPublished: true,
        id: { $ne: job.id },
      },
      {
        fields: ['slug', 'title', 'employmentType.label', 'location'],
        limit: 5,
        orderBy: { createdAt: 'DESC' },
      },
    );

    const relatedJobDtos = relatedJobs.map(
      (relatedJob) =>
        new RelatedJobDto({
          slug: relatedJob.slug,
          title: relatedJob.title,
          employmentType: relatedJob.employmentType.label,
          location: relatedJob.location,
        }),
    );

    const companyDto = new JobCompanyDto({
      slug: job.company.slug,
      name: job.company.name,
      description: job.company.description!,
      logoUrl: job.company.logoUrl,
      size: job.company.size?.label,
      relatedJobs: relatedJobDtos,
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
