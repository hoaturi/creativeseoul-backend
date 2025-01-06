import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTalentQuery } from './get-talent.query';
import { EntityManager, Loaded } from '@mikro-orm/postgresql';
import { Talent } from '../../../../domain/talent/talent.entity';
import { TalentError } from '../../talent.error';
import {
  EMPLOYMENT_TYPES,
  HOURLY_RATE_RANGE,
  SALARY_RANGE,
  WORK_LOCATION_TYPES,
} from '../../../../domain/common/constants';
import { MemberLocationResponseDto } from '../../../common/dtos/member-location-response.dto';
import { MemberLanguageProficiencyResponseDto } from '../../../common/dtos/member-language-proficiency-response.dto';
import { UserRole } from '../../../../domain/user/user-role.enum';
import { ResultError } from '../../../../common/result/result-error';
import { Result } from '../../../../common/result/result';
import { GetTalentResponseDto } from '../../dtos/responses/get-talent-response.dto';

const TALENT_FIELDS = [
  'id',
  'fullName',
  'title',
  'bio',
  'avatarUrl',
  'skills',
  'isAvailable',
  'salaryRangeId',
  'hourlyRateRangeId',
  'locationTypeIds',
  'employmentTypeIds',
  'isPublic',
  'email',
  'phone',
  'socialLinks',
  'country.label',
  'city.label',
  'languages.language.label',
  'languages.level',
] as const;

type TalentFields = (typeof TALENT_FIELDS)[number];
type LoadedTalent = Loaded<Talent, never, TalentFields>;

@QueryHandler(GetTalentQuery)
export class GetTalentHandler implements IQueryHandler<GetTalentQuery> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetTalentQuery,
  ): Promise<Result<GetTalentResponseDto, ResultError>> {
    const talent = await this.findTalentByUser(query.id);

    if (!talent) {
      return Result.failure(TalentError.NotFound);
    }

    if (!this.hasAccessPermission(query.user, talent)) {
      return Result.failure(TalentError.NotFound);
    }

    const response = this.createTalentResponse(talent);
    return Result.success(response);
  }

  private async findTalentByUser(
    talentId: string,
  ): Promise<LoadedTalent | null> {
    return (await this.em.findOne(Talent, talentId, {
      fields: TALENT_FIELDS,
    })) as LoadedTalent | null;
  }

  private hasAccessPermission(
    user: GetTalentQuery['user'],
    talent: LoadedTalent,
  ): boolean {
    const isUserOwner = user.profileId === talent.id;
    const isUserAdmin = user.role === UserRole.ADMIN;
    const isUserCompany = user.role === UserRole.COMPANY;

    if (!talent.isPublic) {
      return isUserOwner || isUserAdmin;
    }

    return isUserCompany || isUserAdmin || isUserOwner;
  }

  private createTalentResponse(talent: LoadedTalent): GetTalentResponseDto {
    const location = new MemberLocationResponseDto(
      talent.country.label,
      talent.city?.label,
    );

    const languages = talent.languages.map(
      (language) =>
        new MemberLanguageProficiencyResponseDto(
          language.language.label,
          language.level,
        ),
    );

    const { salaryRange, hourlyRateRange } = this.mapCompensationRanges(
      talent.salaryRangeId,
      talent.hourlyRateRangeId,
    );

    const { locationTypes, employmentTypes } = this.mapWorkPreferences(
      talent.locationTypeIds,
      talent.employmentTypeIds,
    );

    return new GetTalentResponseDto({
      fullName: talent.fullName,
      title: talent.title,
      bio: talent.bio,
      avatarUrl: talent.avatarUrl,
      location,
      languages,
      socialLinks: talent.socialLinks,
      isAvailable: talent.isAvailable,
      salaryRange,
      hourlyRateRange,
      locationTypes,
      employmentTypes,
      skills: talent.skills,
      email: talent.email,
      phone: talent.phone,
    });
  }

  private mapCompensationRanges(
    salaryId?: number,
    hourlyId?: number,
  ): { salaryRange?: string; hourlyRateRange?: string } {
    const salaryRange =
      salaryId !== undefined ? SALARY_RANGE[salaryId]?.label : undefined;
    const hourlyRateRange =
      hourlyId !== undefined ? HOURLY_RATE_RANGE[hourlyId]?.label : undefined;
    return { salaryRange, hourlyRateRange };
  }

  private mapWorkPreferences(
    locationTypeIds: number[],
    employmentTypeIds: number[],
  ): {
    locationTypes: string[];
    employmentTypes: string[];
  } {
    const locationTypes = locationTypeIds.map(
      (id) => WORK_LOCATION_TYPES[id].label,
    );
    const employmentTypes = employmentTypeIds.map(
      (id) => EMPLOYMENT_TYPES[id].label,
    );
    return { locationTypes, employmentTypes };
  }
}
