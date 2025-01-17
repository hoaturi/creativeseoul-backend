import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRegularJobCommand } from './create-regular-job.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { Job } from '../../../../domain/job/entities/job.entity';
import { Category } from '../../../../domain/job/entities/category.entity';
import { EmploymentType } from '../../../../domain/common/entities/employment-type.entity';
import { SeniorityLevel } from '../../../../domain/job/entities/seniority-level.entity';
import { WorkLocationType } from '../../../../domain/common/entities/work-location-type.entity';
import { LanguageLevel } from '../../../../domain/common/entities/language-level.entity';
import { CreateRegularJobRequestDto } from '../../dtos/create-regular-job-request.dto';
import slugify from 'slugify';
import { Company } from '../../../../domain/company/entities/company.entity';
import { CompanyError } from '../../../company/company.error';

interface JobReferences {
  category: Category;
  employmentType: EmploymentType;
  seniorityLevel: SeniorityLevel;
  workLocationType: WorkLocationType;
  koreanLevel: LanguageLevel;
  englishLevel: LanguageLevel;
}

@CommandHandler(CreateRegularJobCommand)
export class CreateRegularJobHandler
  implements ICommandHandler<CreateRegularJobCommand>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: CreateRegularJobCommand,
  ): Promise<Result<void, ResultError>> {
    const { dto } = command;

    const {
      category,
      employmentType,
      seniorityLevel,
      workLocationType,
      koreanLevel,
      englishLevel,
    } = this.getReferences(dto);

    const company = await this.em.findOne(
      Company,
      { id: dto.companyId },
      {
        fields: ['name'],
      },
    );

    if (!company) {
      return Result.failure(CompanyError.ProfileNotFound);
    }

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
      seniorityLevel,
      workLocationType,
      location: dto.location,
      minSalary: dto.minSalary,
      maxSalary: dto.maxSalary,
      tags: dto.tags,
      koreanLevel,
      englishLevel,
      residentOnly: dto.residentOnly,
      applicationUrl: dto.applicationUrl,
      isFeatured: false,
      isPublished: true,
      applicationClickCount: 0,
    });

    this.em.create(Job, newJob);

    await this.em.flush();

    return Result.success();
  }

  private getReferences(dto: CreateRegularJobRequestDto): JobReferences {
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
