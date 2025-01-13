import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateFeaturedJobCommand } from './create-featured-job.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Company } from '../../../../domain/company/company.entity';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { CompanyError } from '../../../company/company.error';
import { Category } from '../../../../domain/common/entities/category.entity';
import { EmploymentType } from '../../../../domain/common/entities/employment-type.entity';
import { SeniorityLevel } from '../../../../domain/common/entities/seniority-level.entity';
import { WorkLocationType } from '../../../../domain/common/entities/work-location-type.entity';
import { LanguageLevel } from '../../../../domain/common/entities/language-level.entity';
import { Job } from '../../../../domain/job/job.entity';
import { CreateFeaturedJobRequestDto } from '../../dtos/create-featured-job-request.dto';
import {
  CreditTransaction,
  CreditTransactionType,
} from '../../../../domain/company/credit-transaction.entity';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateFeaturedJobCommand)
export class CreateFeaturedJobHandler
  implements ICommandHandler<CreateFeaturedJobCommand>
{
  private readonly logger = new Logger(CreateFeaturedJobHandler.name);

  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: CreateFeaturedJobCommand,
  ): Promise<Result<void, ResultError>> {
    const { user, dto } = command;

    const company = await this.em.findOne(
      Company,
      {
        id: user.profileId,
      },
      {
        fields: ['id', 'creditBalance'],
      },
    );

    if (!company) {
      return Result.failure(CompanyError.ProfileNotFound);
    }

    if (company.creditBalance < 1) {
      return Result.failure(CompanyError.InsufficientCreditBalance);
    }

    const {
      category,
      employmentType,
      seniorityLevel,
      workLocationType,
      koreanLevel,
      englishLevel,
    } = this.getReferences(dto);

    const newJob = new Job({
      company: company as Company,
      title: dto.title,
      description: dto.description,
      category,
      employmentType,
      seniorityLevel,
      workLocationType,
      location: dto.location,
      minSalary: dto.minSalary,
      maxSalary: dto.maxSalary,
      tags: dto.tags,
      koreanLevel,
      englishLevel,
      visaSponsorship: dto.visaSponsorship,
      residentOnly: dto.residentOnly,
      applicationUrl: dto.applicationUrl,
      isFeatured: true,
      isPublished: true,
      applicationClickCount: 0,
    });
    this.em.create(Job, newJob);

    company.creditBalance -= 1;

    const transaction = new CreditTransaction({
      company: company as Company,
      amount: -1,
      type: CreditTransactionType.USAGE,
      job: newJob,
    });
    this.em.create(CreditTransaction, transaction);

    await this.em.flush();

    this.logger.log(
      {
        jobId: newJob.id,
        companyId: company.id,
      },
      'job.create-featured-job.success: Featured job created successfully',
    );

    return Result.success();
  }

  private getReferences(dto: CreateFeaturedJobRequestDto) {
    const category = this.em.getReference(Category, dto.categoryId);
    const employmentType = this.em.getReference(
      EmploymentType,
      dto.employmentTypeId,
    );
    const seniorityLevel = this.em.getReference(
      SeniorityLevel,
      dto.seniorityLevelId,
    );
    const workLocationType = this.em.getReference(
      WorkLocationType,
      dto.workLocationTypeId,
    );
    const koreanLevel = this.em.getReference(LanguageLevel, dto.koreanLevelId);
    const englishLevel = this.em.getReference(
      LanguageLevel,
      dto.englishLevelId,
    );

    return {
      category,
      employmentType,
      seniorityLevel,
      workLocationType,
      koreanLevel,
      englishLevel,
    };
  }
}
