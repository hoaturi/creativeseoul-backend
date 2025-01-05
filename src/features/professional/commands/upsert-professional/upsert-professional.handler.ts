import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpsertProfessionalCommand } from './upsert-professional.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Logger } from '@nestjs/common';
import { Professional } from '../../../../domain/professional/professional.entity';
import { UpsertProfessionalRequestDto } from '../../dtos/requests/upsert-professional-request.dto';
import { ProfessionalExperience } from '../../../../domain/professional/professional-experience.entity';
import { ProfessionalProject } from '../../../../domain/professional/professional-project.entity';
import { Member } from '../../../../domain/member/member.entity';
import { ProfessionalExperienceRequestDto } from '../../dtos/requests/professional-experience-request.dto';
import { ProfessionalProjectRequestDto } from '../../dtos/requests/professional-project-request.dto';

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

    const professional = await this.em.findOne(
      Professional,
      {
        member: profileId,
      },
      {
        populate: ['experiences', 'projects'],
      },
    );

    if (!professional) {
      await this.createProfessional(profileId, dto);
      return Result.success();
    }

    await this.updateProfessional(professional, dto);
    return Result.success();
  }

  private async createProfessional(
    memberId: string,
    dto: UpsertProfessionalRequestDto,
  ): Promise<void> {
    const member = this.em.getReference(Member, memberId);
    const { experiences: experiencesDto, projects: projectsDto, ...data } = dto;

    const professional = new Professional(member, data);
    const experiences = this.mapExperiences(experiencesDto);
    const projects = this.mapProjects(projectsDto);

    this.em.persist(professional);
    this.em.persist(experiences);
    this.em.persist(projects);

    professional.experiences.add(experiences);
    professional.projects.add(projects);

    await this.em.flush();

    this.logger.log(
      { professionalId: professional.id },
      'professional.upsert-professional.success: Professional created successfully',
    );
  }

  private async updateProfessional(
    professional: Professional,
    dto: UpsertProfessionalRequestDto,
  ): Promise<void> {
    const { experiences: experiencesDto, projects: projectsDto, ...data } = dto;

    Object.assign(professional, data);

    const experiences = this.mapExperiences(experiencesDto);
    const projects = this.mapProjects(projectsDto);

    this.em.persist(experiences);
    this.em.persist(projects);

    professional.experiences.set(experiences);
    professional.projects.set(projects);

    await this.em.flush();

    this.logger.log(
      { professionalId: professional.id },
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
