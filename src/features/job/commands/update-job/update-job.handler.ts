import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateJobCommand } from './update-job.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { JobError } from '../../job.error';
import { Job } from '../../../../domain/job/entities/job.entity';
import { UserRole } from '../../../../domain/user/user-role.enum';
import { Category } from '../../../../domain/job/entities/category.entity';
import { EmploymentType } from '../../../../domain/common/entities/employment-type.entity';
import { ExperienceLevel } from '../../../../domain/job/entities/experience-level.entity';
import { WorkLocationType } from '../../../../domain/common/entities/work-location-type.entity';
import { LanguageLevel } from '../../../../domain/common/entities/language-level.entity';
import { Logger } from '@nestjs/common';
import { UpdateJobRequestDto } from '../../dtos/requests/update-job-request.dto';

interface JobReferences {
  category: Category;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  workLocationType: WorkLocationType;
  koreanLevel: LanguageLevel;
  englishLevel: LanguageLevel;
}

@CommandHandler(UpdateJobCommand)
export class UpdateJobHandler implements ICommandHandler<UpdateJobCommand> {
  private readonly logger = new Logger(UpdateJobHandler.name);

  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: UpdateJobCommand,
  ): Promise<Result<void, ResultError>> {
    const { user, slug, dto } = command;

    const job = await this.em.findOne(
      Job,
      { slug },
      {
        fields: [
          'title',
          'description',
          'category.id',
          'employmentType.id',
          'experienceLevel.id',
          'workLocationType.id',
          'location',
          'minSalary',
          'maxSalary',
          'tags',
          'koreanLevel.id',
          'englishLevel.id',
          'residentOnly',
          'applicationUrl',
          'company.id',
        ],
      },
    );

    if (!job) {
      return Result.failure(JobError.NotFound);
    }

    const isOwner = job.company.id === command.user.profile.id;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      return Result.failure(JobError.PermissionDenied);
    }

    const {
      category,
      employmentType,
      experienceLevel,
      workLocationType,
      koreanLevel,
      englishLevel,
    } = this.getReferences(dto);

    job.title = dto.title;
    job.description = dto.description;
    job.category = category;
    job.employmentType = employmentType;
    job.experienceLevel = experienceLevel;
    job.workLocationType = workLocationType;
    job.location = dto.location;
    job.minSalary = dto.minSalary;
    job.maxSalary = dto.maxSalary;
    job.tags = dto.tags;
    job.koreanLevel = koreanLevel;
    job.englishLevel = englishLevel;
    job.residentOnly = dto.residentOnly;
    job.applicationUrl = dto.applicationUrl;

    await this.em.flush();

    if (isOwner) {
      this.logger.log(
        {
          companyId: user.profile.id,
          jobId: job.id,
        },
        'job.update-job.success: Job updated successfully',
      );
    } else {
      this.logger.log(
        {
          jobId: job.id,
        },
        'job.update-job.success: Job updated successfully by admin',
      );
    }

    return Result.success();
  }

  private getReferences(dto: UpdateJobRequestDto): JobReferences {
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
