import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpsertCandidateCommand } from './upsert-candidate.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { Logger } from '@nestjs/common';
import { Candidate } from '../../../../domain/candidate/candidate.entity';
import { UpsertCandidateRequestDto } from '../../dtos/upsert-candidate-request.dto';
import { CandidateExperience } from '../../../../domain/candidate/candidate-experience.entity';
import { CandidateProject } from '../../../../domain/candidate/candidate-project.entity';
import { CandidateExperienceDto } from '../../dtos/candidate-experience.dto';
import { CandidateProjectDto } from '../../dtos/candidate-project.dto';
import { Member } from '../../../../domain/member/member.entity';
import { User } from '../../../../domain/user/user.entity';

@CommandHandler(UpsertCandidateCommand)
export class UpsertCandidateHandler
  implements ICommandHandler<UpsertCandidateCommand>
{
  private readonly logger = new Logger(UpsertCandidateHandler.name);
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: UpsertCandidateCommand,
  ): Promise<Result<void, ResultError>> {
    const { dto, userId } = command;

    const user = await this.em.findOne(User, userId, {
      populate: ['member.candidate'],
    });

    if (!user.member.candidate) {
      await this.createCandidate(user.member, dto);
      return Result.success();
    }

    await this.updateExistingCandidate(user.member.candidate, dto);
    return Result.success();
  }

  private async createCandidate(
    member: Member,
    dto: UpsertCandidateRequestDto,
  ): Promise<void> {
    const candidate = this.em.create(
      Candidate,
      new Candidate(
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

    candidate.experiences.add(experiences);
    candidate.projects.add(projects);

    await this.em.flush();

    this.logger.log(
      {
        candidateId: candidate.id,
      },
      'candidate.upsert-candidate.success: Candidate created successfully',
    );

    member.candidate = candidate;
  }

  private async updateExistingCandidate(
    candidate: Candidate,
    dto: UpsertCandidateRequestDto,
  ): Promise<void> {
    candidate.isPublic = dto.isPublic;
    candidate.isOpenToWork = dto.isOpenToWork;
    candidate.salaryRange = dto.salaryRange;
    candidate.hourlyRateRange = dto.hourlyRateRange;
    candidate.employmentTypes = dto.employmentTypes;
    candidate.locationTypes = dto.locationTypes;
    candidate.skills = dto.skills;
    candidate.resumeUrl = dto.resumeUrl;
    candidate.isContactable = dto.isContactable;
    candidate.email = dto.email;
    candidate.phone = dto.phone;

    const experiences = this.mapExperiences(dto.experiences);
    const projects = this.mapProjects(dto.projects);

    candidate.experiences.set(experiences);
    candidate.projects.set(projects);

    await this.em.flush();

    this.logger.log(
      {
        candidateId: candidate.id,
      },
      'candidate.upsert-candidate.success: Candidate updated successfully',
    );
  }

  private mapExperiences(
    experiences: CandidateExperienceDto[],
  ): CandidateExperience[] {
    return experiences.map(
      (experience) =>
        new CandidateExperience(
          experience.title,
          experience.yearsOfExperience,
          experience.description,
        ),
    );
  }

  private mapProjects(projects: CandidateProjectDto[]): CandidateProject[] {
    return projects.map(
      (project) =>
        new CandidateProject(project.title, project.description, project.url),
    );
  }
}
