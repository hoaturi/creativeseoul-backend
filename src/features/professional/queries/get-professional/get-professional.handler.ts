import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfessionalQuery } from './get-professional.query';
import { EntityManager, Loaded } from '@mikro-orm/postgresql';
import { GetProfessionalResponseDto } from '../../dtos/get-professional-response.dto';
import { Professional } from '../../../../domain/professional/professional.entity';
import { ProfessionalError } from '../../professional.error';
import { ProfessionalMemberResponseDto } from '../../dtos/professional-member-response.dto';
import { ProfessionalExperienceResponseDto } from '../../dtos/professional-experience-response.dto';
import { ProfessionalProjectResponseDto } from '../../dtos/professional-project-response.dto';
import {
  EMPLOYMENT_TYPES,
  HOURLY_RATE_RANGE,
  LOCATION_TYPES,
  SALARY_RANGE,
} from '../../../../domain/common/constants';
import { MemberLocationResponseDto } from '../../../common/dtos/member-location-response.dto';
import { MemberLanguageProficiencyResponseDto } from '../../../common/dtos/member-language-proficiency-response.dto';
import { UserRole } from '../../../../domain/user/user-role.enum';
import { ResultError } from '../../../../common/result/result-error';
import { Result } from '../../../../common/result/result';

const PROFESSIONAL_FIELDS = [
  // Professional fields
  'isOpenToWork',
  'salaryRangeId',
  'hourlyRateRangeId',
  'locationTypeIds',
  'employmentTypeIds',
  'skills',
  'isPublic',
  'email',
  'phone',
  'resumeUrl',
  // Member fields
  'member.handle',
  'member.fullName',
  'member.title',
  'member.bio',
  'member.avatarUrl',
  'member.tags',
  'member.socialLinks',
  'member.country.name',
  'member.city.name',
  'member.languages.language.name',
  'member.languages.level',
  // Experience fields
  'experiences.title',
  'experiences.yearsOfExperience',
  'experiences.description',
  // Project fields
  'projects.title',
  'projects.description',
  'projects.url',
] as const;

// Derive the types from the array
type ProfessionalFields = (typeof PROFESSIONAL_FIELDS)[number];

// Update LoadedProfessional to use this type
type LoadedProfessional = Loaded<Professional, never, ProfessionalFields>;
type LoadedMember = LoadedProfessional['member'];

@QueryHandler(GetProfessionalQuery)
export class GetProfessionalHandler
  implements IQueryHandler<GetProfessionalQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetProfessionalQuery,
  ): Promise<Result<GetProfessionalResponseDto, ResultError>> {
    const professional = await this.findProfessionalByHandle(query.handle);

    if (!professional) {
      return Result.failure(ProfessionalError.NotFound);
    }

    if (!this.hasAccessPermission(query.user, professional)) {
      return Result.failure(ProfessionalError.NotFound);
    }

    return Result.success(this.createProfessionalResponse(professional));
  }

  private async findProfessionalByHandle(
    handle: string,
  ): Promise<LoadedProfessional | null> {
    return (await this.em.findOne(
      Professional,
      { member: { handle } },
      { fields: PROFESSIONAL_FIELDS },
    )) as LoadedProfessional | null;
  }

  private hasAccessPermission(
    user: GetProfessionalQuery['user'],
    professional: LoadedProfessional,
  ): boolean {
    const isUserOwner = user.profileId === professional.member.id;
    const isUserAdmin = user.role === UserRole.ADMIN;
    const isUserCompany = user.role === UserRole.COMPANY;

    if (!professional.isPublic) {
      return isUserOwner || isUserAdmin;
    }

    return isUserCompany || isUserAdmin || isUserOwner;
  }

  private createProfessionalResponse(
    professional: LoadedProfessional,
  ): GetProfessionalResponseDto {
    const memberDto = this.mapMemberProfile(professional.member);
    return this.createProfessionalDto(professional, memberDto);
  }

  private mapMemberProfile(
    member: LoadedMember,
  ): ProfessionalMemberResponseDto {
    const location = new MemberLocationResponseDto(
      member.country.name,
      member.city?.name,
    );

    const languages = this.mapLanguageProficiencies(member.languages);

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

  private mapLanguageProficiencies(
    languages: LoadedMember['languages'],
  ): MemberLanguageProficiencyResponseDto[] {
    return languages.map(
      (language) =>
        new MemberLanguageProficiencyResponseDto(
          language.language.name,
          language.level,
        ),
    );
  }

  private createProfessionalDto(
    professional: LoadedProfessional,
    memberDto: ProfessionalMemberResponseDto,
  ): GetProfessionalResponseDto {
    const { salaryRange, hourlyRateRange } = this.mapCompensationRanges(
      professional.salaryRangeId,
      professional.hourlyRateRangeId,
    );

    const { locationTypes, employmentTypes } = this.mapWorkPreferences(
      professional.locationTypeIds,
      professional.employmentTypeIds,
    );

    const { experiences, projects } = this.mapExperiencesAndProjects(
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

  private mapCompensationRanges(
    salaryId: number,
    hourlyId: number,
  ): { salaryRange: string; hourlyRateRange: string } {
    const salaryRange = SALARY_RANGE[salaryId]?.name;
    const hourlyRateRange = HOURLY_RATE_RANGE[hourlyId]?.name;
    return { salaryRange, hourlyRateRange };
  }

  private mapWorkPreferences(
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

  private mapExperiencesAndProjects(
    experienceCollection: LoadedProfessional['experiences'],
    projectCollection: LoadedProfessional['projects'],
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
}
