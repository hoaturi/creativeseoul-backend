import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTalentQuery } from './get-talent.query';
import { EntityManager, Loaded } from '@mikro-orm/postgresql';
import { Talent } from '../../../../domain/talent/entities/talent.entity';
import { TalentError } from '../../talent.error';
import { TalentLocationDto } from '../../dtos/responses/talent-location.dto';
import { TalentLanguageDto } from '../../dtos/responses/talent-language.dto';
import { UserRole } from '../../../../domain/user/user-role.enum';
import { ResultError } from '../../../../common/result/result-error';
import { Result } from '../../../../common/result/result';
import { GetTalentResponseDto } from '../../dtos/responses/get-talent-response.dto';
import { TalentWorkLocationTypeDto } from '../../dtos/responses/talent-work-location-type.dto';
import { TalentEmploymentTypeDto } from '../../dtos/responses/talent-employment-type.dto';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

const TALENT_FIELDS = [
  'id',
  'fullName',
  'title',
  'bio',
  'avatarUrl',
  'skills',
  'isAvailable',
  'salaryRange',
  'hourlyRateRange',
  'workLocationTypes',
  'employmentTypes',
  'email',
  'phone',
  'socialLinks',
  'country.label',
  'city.label',
  'languages.language.label',
  'languages.level',
  'salaryRange.id',
  'salaryRange.label',
  'hourlyRateRange.id',
  'hourlyRateRange.label',
  'workLocationTypes.id',
  'workLocationTypes.label',
  'employmentTypes.id',
  'employmentTypes.label',
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
      return Result.failure(TalentError.ProfileNotFound);
    }

    if (!this.hasAccessPermission(query.user, talent)) {
      return Result.failure(TalentError.ProfileNotFound);
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
    user: AuthenticatedUser,
    talent: LoadedTalent,
  ): boolean {
    const isUserOwner = user.profile.id === talent.id;
    const isUserAdmin = user.role === UserRole.ADMIN;
    const isUserCompany = user.role === UserRole.COMPANY;

    return isUserCompany || isUserAdmin || isUserOwner;
  }

  private createTalentResponse(talent: LoadedTalent): GetTalentResponseDto {
    const location = new TalentLocationDto(
      talent.country.label,
      talent.city?.label,
    );

    const languages = talent.languages.map(
      (language) =>
        new TalentLanguageDto(language.language.label, language.level.label),
    );

    const salaryRange = talent.salaryRange?.label;

    const hourlyRateRange = talent.hourlyRateRange?.label;

    const workLocationTypes = talent.workLocationTypes.map(
      (type) => new TalentWorkLocationTypeDto(type.id, type.label),
    );

    const employmentTypes = talent.employmentTypes.map(
      (type) => new TalentEmploymentTypeDto(type.id, type.label),
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
      workLocationTypes,
      employmentTypes,
      skills: talent.skills,
      email: talent.email,
      phone: talent.phone,
    });
  }
}
