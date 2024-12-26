import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpsertProfessionalCommand } from './upsert-professional.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Logger } from '@nestjs/common';
import { Professional } from '../../../../domain/professional/professional.entity';
import { UpsertProfessionalRequestDto } from '../../dtos/upsert-professional-request.dto';
import { ProfessionalExperience } from '../../../../domain/professional/professional-experience.entity';
import { ProfessionalProject } from '../../../../domain/professional/professional-project.entity';
import { Member } from '../../../../domain/member/member.entity';
import { ProfessionalExperienceRequestDto } from '../../dtos/professional-experience-request.dto';
import { ProfessionalProjectRequestDto } from '../../dtos/professional-project-request.dto';

@CommandHandler(UpsertProfessionalCommand)
export class UpsertProfessionalHandler
  implements ICommandHandler<UpsertProfessionalCommand>
{
  private readonly logger = new Logger(UpsertProfessionalHandler.name);
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: UpsertProfessionalCommand,
  ): Promise<Result<void, ResultError>> {
    const { dto, profileId } = command;

    const member = await this.em.findOne(Member, profileId, {
      fields: ['id', 'professional'],
      populate: ['professional'],
    });

    if (!member.professional) {
      await this.createProfessional(member.id, dto);
      return Result.success();
    }

    await this.updateExistingProfessional(member.professional, dto);
    return Result.success();
  }

  private async createProfessional(
    memberId: string,
    dto: UpsertProfessionalRequestDto,
  ): Promise<void> {
    const member = this.em.getReference(Member, memberId);

    const professional = this.em.create(
      Professional,
      new Professional(
        member,
        dto.isOpenToWork,
        dto.isContactable,
        dto.isPublic,
        dto.salaryRange,
        dto.hourlyRateRange,
        dto.locationTypes,
        dto.employmentTypes,
        dto.skills,
        dto.resumeUrl,
        dto.email,
        dto.phone,
      ),
    );

    const experiences = this.mapExperiences(dto.experiences);
    const projects = this.mapProjects(dto.projects);

    professional.experiences.add(experiences);
    professional.projects.add(projects);

    await this.em.flush();

    this.logger.log(
      {
        professionalId: professional.id,
      },
      'professional.upsert-professional.success: Professional created successfully',
    );
  }

  private async updateExistingProfessional(
    professional: Professional,
    dto: UpsertProfessionalRequestDto,
  ): Promise<void> {
    professional.isPublic = dto.isPublic;
    professional.isOpenToWork = dto.isOpenToWork;
    professional.salaryRange = dto.salaryRange;
    professional.hourlyRateRange = dto.hourlyRateRange;
    professional.employmentTypes = dto.employmentTypes;
    professional.locationTypes = dto.locationTypes;
    professional.skills = dto.skills;
    professional.resumeUrl = dto.resumeUrl;
    professional.isContactable = dto.isContactable;
    professional.email = dto.email;
    professional.phone = dto.phone;

    const experiences = this.mapExperiences(dto.experiences);
    const projects = this.mapProjects(dto.projects);

    professional.experiences.set(experiences);
    professional.projects.set(projects);

    await this.em.flush();

    this.logger.log(
      {
        professionalId: professional.id,
      },
      'professional.upsert-professional.success: Professional updated successfully',
    );
  }

  private mapExperiences(
    experiences: ProfessionalExperienceRequestDto[],
  ): ProfessionalExperience[] {
    return experiences.map(
      (experience) =>
        new ProfessionalExperience(
          experience.title,
          experience.yearsOfExperience,
          experience.description,
        ),
    );
  }

  private mapProjects(
    projects: ProfessionalProjectRequestDto[],
  ): ProfessionalProject[] {
    return projects.map(
      (project) =>
        new ProfessionalProject(
          project.title,
          project.description,
          project.url,
        ),
    );
  }
}
