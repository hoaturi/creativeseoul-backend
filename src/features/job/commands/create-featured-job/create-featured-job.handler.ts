import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateFeaturedJobCommand } from './create-featured-job.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Company } from '../../../../domain/company/entities/company.entity';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { CompanyError } from '../../../company/company.error';
import { Category } from '../../../../domain/job/entities/category.entity';
import { EmploymentType } from '../../../../domain/common/entities/employment-type.entity';
import { ExperienceLevel } from '../../../../domain/job/entities/experience-level.entity';
import { WorkLocationType } from '../../../../domain/common/entities/work-location-type.entity';
import { LanguageLevel } from '../../../../domain/common/entities/language-level.entity';
import { Job } from '../../../../domain/job/entities/job.entity';
import { CreateFeaturedJobRequestDto } from '../../dtos/requests/create-featured-job-request.dto';
import {
  CreditTransaction,
  CreditTransactionType,
} from '../../../../domain/company/entities/credit-transaction.entity';
import { Logger } from '@nestjs/common';
import slugify from 'slugify';

interface JobReferences {
  category: Category;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  workLocationType: WorkLocationType;
  koreanLevel: LanguageLevel;
  englishLevel: LanguageLevel;
}

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
        id: user.profile.id!,
      },
      {
        fields: ['id', 'name', 'creditBalance'],
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
      experienceLevel,
      workLocationType,
      koreanLevel,
      englishLevel,
    } = this.getReferences(dto);

    const randomStr = Math.random().toString(36).substring(2, 8);
    const slug =
      `${slugify(company.name)}-${slugify(dto.title)}-${randomStr}`.toLowerCase();

    const newJob = new Job({
      company: company as Company,
      slug,
      title: dto.title,
      description: dto.description,
      category,
      employmentType,
      experienceLevel,
      workLocationType,
      location: dto.location,
      minSalary: dto.minSalary,
      maxSalary: dto.maxSalary,
      tags: dto.tags,
      koreanLevel,
      englishLevel,
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

  private getReferences(dto: CreateFeaturedJobRequestDto): JobReferences {
    const category = this.em.getReference(Category, dto.categoryId);
    const employmentType = this.em.getReference(
      EmploymentType,
      dto.employmentTypeId,
    );
    const experienceLevel = this.em.getReference(
      ExperienceLevel,
      dto.experienceLevelId,
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
      experienceLevel,
      workLocationType,
      koreanLevel,
      englishLevel,
    };
  }
}
