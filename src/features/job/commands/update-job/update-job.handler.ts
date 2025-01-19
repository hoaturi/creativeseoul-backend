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
import { SeniorityLevel } from '../../../../domain/job/entities/seniority-level.entity';
import { WorkLocationType } from '../../../../domain/common/entities/work-location-type.entity';
import { LanguageLevel } from '../../../../domain/common/entities/language-level.entity';
import { Logger } from '@nestjs/common';
import { UpdateJobRequestDto } from '../../dtos/requests/update-job-request.dto';

interface JobReferences {
  category: Category;
  employmentType: EmploymentType;
  seniorityLevel: SeniorityLevel;
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
          'seniorityLevel.id',
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

    const isOwner = job.company.id === command.user.profileId;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      return Result.failure(JobError.PermissionDenied);
    }

    const {
      category,
      employmentType,
      seniorityLevel,
      workLocationType,
      koreanLevel,
      englishLevel,
    } = this.getReferences(dto);

    job.title = dto.title;
    job.description = dto.description;
    job.category = category;
    job.employmentType = employmentType;
    job.seniorityLevel = seniorityLevel;
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
          companyId: user.profileId,
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
