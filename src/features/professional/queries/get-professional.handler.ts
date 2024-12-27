import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfessionalQuery } from './get-professional.query';
import { Collection, EntityManager } from '@mikro-orm/postgresql';
import { GetProfessionalResponseDto } from '../dtos/get-professional-response.dto';
import { Professional } from '../../../domain/professional/professional.entity';
import { ProfessionalError } from '../professional.error';
import { ProfessionalMemberResponseDto } from '../dtos/professional-member-response.dto';
import { ProfessionalExperienceResponseDto } from '../dtos/professional-experience-response.dto';
import { ProfessionalProjectResponseDto } from '../dtos/professional-project-response.dto';
import {
  EMPLOYMENT_TYPES,
  HOURLY_RATE_RANGE,
  LOCATION_TYPES,
  SALARY_RANGE,
} from '../../../domain/common/constants';
import { MemberLocationResponseDto } from '../../common/dtos/member-location-response.dto';
import { MemberLanguageProficiencyResponseDto } from '../../common/dtos/member-language-proficiency-response.dto';
import { UserRole } from '../../../domain/user/user-role.enum';
import { Member } from '../../../domain/member/member.entity';
import { ProfessionalExperience } from '../../../domain/professional/professional-experience.entity';
import { ProfessionalProject } from '../../../domain/professional/professional-project.entity';
import { ResultError } from '../../../common/result/result-error';
import { Result } from '../../../common/result/result';

@QueryHandler(GetProfessionalQuery)
export class GetProfessionalHandler
  implements IQueryHandler<GetProfessionalQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetProfessionalQuery,
  ): Promise<Result<GetProfessionalResponseDto, ResultError>> {
    const professional = await this.em.findOne(
      Professional,
      {
        member: { handle: query.handle },
      },
      {
        populate: [
          'member.country',
          'member.city',
          'member.languages.language',
          'experiences',
          'projects',
        ],
      },
    );

    if (!professional) {
      return Result.failure(ProfessionalError.NotFound);
    }

    const isUserOwner = query.user.profileId === professional.member.id;
    const isUserAdmin = query.user.role === UserRole.ADMIN;
    const isUserCompany = query.user.role === UserRole.COMPANY;

    // For private profiles (isPublic is false):
    // - Only owner or admin can access
    // For public profiles (isPublic is true):
    // - Only company or admin can access

    if (
      (!professional.isPublic && !isUserOwner && !isUserAdmin) ||
      (professional.isPublic && !isUserCompany && !isUserAdmin && !isUserOwner)
    ) {
      return Result.failure(ProfessionalError.NotFound);
    }

    const memberDto = this.mapMember(professional.member);
    const response = this.mapProfessional(professional, memberDto);

    return Result.success(response);
  }

  private mapMember(member: Member): ProfessionalMemberResponseDto {
    const location = new MemberLocationResponseDto(
      member.country.name,
      member.city?.name,
    );
    const languages = member.languages.map(
      (language) =>
        new MemberLanguageProficiencyResponseDto(
          language.language.name,
          language.level,
        ),
    );

    return new ProfessionalMemberResponseDto({
      handle: member.handle,
      fullName: member.fullName,
      title: member.title,
      bio: member.bio,
      avatarUrl: member.avatarUrl,
      tags: member.tags,
      location,
      languages,
      socialLinks: member.socialLinks,
    });
  }

  private mapCompensation(
    salaryId: number,
    hourlyId: number,
  ): { salaryRange: string; hourlyRateRange: string } {
    const salaryRange = SALARY_RANGE[salaryId]?.name;
    const hourlyRateRange = HOURLY_RATE_RANGE[hourlyId]?.name;
    return { salaryRange, hourlyRateRange };
  }

  private mapPreferences(
    locationTypeIds: number[],
    employmentTypeIds: number[],
  ): {
    locationTypes: string[];
    employmentTypes: string[];
  } {
    const locationTypes = locationTypeIds.map((id) => LOCATION_TYPES[id].name);
    const employmentTypes = employmentTypeIds.map(
      (id) => EMPLOYMENT_TYPES[id].name,
    );
    return { locationTypes, employmentTypes };
  }

  private MapCareer(
    experienceCollection: Collection<ProfessionalExperience>,
    projectCollection: Collection<ProfessionalProject>,
  ): {
    experiences: ProfessionalExperienceResponseDto[];
    projects: ProfessionalProjectResponseDto[];
  } {
    const experiences = experienceCollection.getItems().map(
      (experience) =>
        new ProfessionalExperienceResponseDto({
          title: experience.title,
          yearsOfExperience: experience.yearsOfExperience,
          description: experience.description,
        }),
    );

    const projects = projectCollection.getItems().map(
      (project) =>
        new ProfessionalProjectResponseDto({
          title: project.title,
          description: project.description,
          url: project.url,
        }),
    );

    return { experiences, projects };
  }

  private mapProfessional(
    professional: Professional,
    memberDto: ProfessionalMemberResponseDto,
  ): GetProfessionalResponseDto {
    const { salaryRange, hourlyRateRange } = this.mapCompensation(
      professional.salaryRangeId,
      professional.hourlyRateRangeId,
    );

    const { locationTypes, employmentTypes } = this.mapPreferences(
      professional.locationTypeIds,
      professional.employmentTypeIds,
    );

    const { experiences, projects } = this.MapCareer(
      professional.experiences,
      professional.projects,
    );

    return new GetProfessionalResponseDto(memberDto, {
      isOpenToWork: professional.isOpenToWork,
      salaryRange,
      hourlyRateRange,
      locationTypes,
      employmentTypes,
      experiences,
      projects,
      skills: professional.skills,
      resumeUrl: professional.resumeUrl,
      email: professional.email,
      phone: professional.phone,
    });
  }
}
