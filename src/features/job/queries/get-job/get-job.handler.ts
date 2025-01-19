import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetJobQuery } from './get-job.query';
import { EntityManager } from '@mikro-orm/core';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import {
  GetJobResponseDto,
  JobCompanyDto,
} from '../../dtos/responses/get-job-response.dto';
import { Job } from '../../../../domain/job/entities/job.entity';
import { JobError } from '../../job.error';
import { UserRole } from '../../../../domain/user/user-role.enum';

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
          'seniorityLevel.label',
          'workLocationType.label',
          'location',
          'minSalary',
          'maxSalary',
          'tags',
          'koreanLevel',
          'englishLevel',
          'residentOnly',
          'residentOnly',
          'applicationUrl',
          'isPublished',
          'company.id',
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

    const isOwner = job.company.id === query.user?.profileId;
    const isAdmin = query.user?.role === UserRole.ADMIN;

    if (!job.isPublished && !isOwner && !isAdmin) {
      return Result.failure(JobError.NotFound);
    }

    const companyDto = new JobCompanyDto({
      id: job.company.id,
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
      seniorityLevel: job.seniorityLevel.label,
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
