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
import { AvailabilityStatusId } from '../../../../domain/talent/constants/availability-status.constant';

const TALENT_FIELDS = [
  'id',
  'handle',
  'fullName',
  'title',
  'bio',
  'avatarUrl',
  'skills',
  'availabilityStatus.label',
  'salaryRange',
  'hourlyRateRange',
  'workLocationTypes',
  'employmentTypes',
  'experienceLevel.label',
  'isContactable',
  'email',
  'phone',
  'socialLinks',
  'country.label',
  'city.label',
  'languages.language.label',
  'languages.level.label',
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
    const talent = await this.findTalent(query.handle);

    if (!talent) {
      return Result.failure(TalentError.ProfileNotFound);
    }

    if (
      query.user?.profile?.id !== talent.id &&
      talent.availabilityStatus.id === AvailabilityStatusId.NOT_LOOKING
    ) {
      return Result.failure(TalentError.ProfileNotFound);
    }

    const response = this.createTalentResponse(talent, query.user);
    return Result.success(response);
  }

  private async findTalent(handle: string): Promise<LoadedTalent | null> {
    return (await this.em.findOne(
      Talent,
      {
        handle,
      },
      {
        fields: TALENT_FIELDS,
      },
    )) as LoadedTalent | null;
  }

  private createTalentResponse(
    talent: LoadedTalent,
    user?: AuthenticatedUser,
  ): GetTalentResponseDto {
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

    // Determine if contact info should be shown based on user role directly in this method
    const isAdminOrCompany =
      user?.role === UserRole.ADMIN || user?.role === UserRole.COMPANY;
    const showContactInfo = isAdminOrCompany && talent.isContactable;

    return new GetTalentResponseDto({
      handle: talent.handle,
      fullName: talent.fullName,
      title: talent.title,
      bio: talent.bio,
      avatarUrl: talent.avatarUrl,
      location,
      languages,
      socialLinks: talent.socialLinks,
      availabilityStatus: talent.availabilityStatus.label,
      salaryRange,
      hourlyRateRange,
      experienceLevel: talent.experienceLevel?.label,
      workLocationTypes,
      employmentTypes,
      skills: talent.skills,
      isContactable: talent.isContactable,
      email: showContactInfo ? talent.email : undefined,
      phone: showContactInfo ? talent.phone : undefined,
    });
  }
}
