import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMyTalentQuery } from './get-my-talent.query';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { EntityManager } from '@mikro-orm/core';
import { Talent } from '../../../../domain/talent/entities/talent.entity';
import { TalentError } from '../../talent.error';
import { MyTalentLanguageDto } from '../../dtos/responses/my-talent-language.dto';
import { MyTalentWorkLocationTypeDto } from '../../dtos/responses/my-talent-work-location-type.dto';
import { MyTalentEmploymentTypeDto } from '../../dtos/responses/my-talent-employment-type.dto';
import { GetMyTalentResponseDto } from '../../dtos/responses/get-my-talent-response.dto';

const TALENT_FIELDS = [
  'id',
  'handle',
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
  'country.id',
  'city.label',
  'languages.language.id',
  'languages.level.id',
  'salaryRange.id',
  'hourlyRateRange.id',
  'workLocationTypes.id',
  'employmentTypes.id',
] as const;

@QueryHandler(GetMyTalentQuery)
export class GetMyTalentHandler implements IQueryHandler<GetMyTalentQuery> {
  public constructor(private em: EntityManager) {}

  public async execute(
    query: GetMyTalentQuery,
  ): Promise<Result<GetMyTalentResponseDto, ResultError>> {
    const { user } = query;

    if (!user.profile.id) {
      return Result.failure(TalentError.ProfileNotFound);
    }

    const talent = await this.em.findOne(
      Talent,
      { id: user.profile.id },
      {
        fields: TALENT_FIELDS,
      },
    );

    if (!talent) {
      return Result.failure(TalentError.ProfileNotFound);
    }

    const languages = talent.languages.map(
      (language) =>
        new MyTalentLanguageDto(language.language.id, language.level.id),
    );

    const workLocationTypes = talent.workLocationTypes.map(
      (type) => new MyTalentWorkLocationTypeDto(type.id),
    );

    const employmentTypes = talent.employmentTypes.map(
      (type) => new MyTalentEmploymentTypeDto(type.id),
    );

    const response = new GetMyTalentResponseDto({
      handle: talent.handle,
      fullName: talent.fullName,
      title: talent.title,
      bio: talent.bio,
      avatarUrl: talent.avatarUrl,
      countryId: talent.country.id,
      city: talent.city?.label,
      languages,
      socialLinks: talent.socialLinks,
      isAvailable: talent.isAvailable,
      salaryRangeId: talent.salaryRange?.id,
      hourlyRateRangeId: talent.hourlyRateRange?.id,
      workLocationTypes,
      employmentTypes,
      skills: talent.skills,
      email: talent.email,
      phone: talent.phone,
    });

    return Result.success(response);
  }
}
