import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTalentCommand } from './update-talent.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Logger } from '@nestjs/common';
import { Talent } from '../../../../domain/talent/talent.entity';
import { UpdateTalentRequestDto } from '../../dtos/requests/update-talent-request.dto';
import { Country } from '../../../../domain/common/entities/country.entity';
import { City } from '../../../../domain/common/entities/city.entity';
import { Language } from '../../../../domain/common/entities/language.entity';
import { TalentLanguage } from '../../../../domain/talent/talent-language.entity';
import { TalentScoringService } from '../../../../infrastructure/services/talent-scoring/talent-scoring.service';
import { TalentLanguageDto } from '../../dtos/requests/talent-language.dto';
import { SalaryRange } from '../../../../domain/common/entities/salary-range.entity';
import slugify from 'slugify';
import { HourlyRateRange } from '../../../../domain/common/entities/hourly-rate-range.entity';
import { WorkLocationType } from '../../../../domain/common/entities/work-location-type.entity';
import { EmploymentType } from '../../../../domain/common/entities/employment-type.entity';
import { LanguageLevel } from '../../../../domain/common/entities/language-level.entity';
import { TalentError } from '../../talent.error';

@CommandHandler(UpdateTalentCommand)
export class UpdateTalentHandler
  implements ICommandHandler<UpdateTalentCommand>
{
  private readonly logger = new Logger(UpdateTalentHandler.name);
  private readonly COOLDOWN_PERIOD = 14 * 24 * 60 * 60 * 1000;

  public constructor(
    private readonly em: EntityManager,
    private readonly scoringService: TalentScoringService,
  ) {}

  public async execute(
    command: UpdateTalentCommand,
  ): Promise<Result<void, ResultError>> {
    const { dto, user } = command;

    const talent = await this.em.findOne(Talent, user.profileId, {
      populate: ['languages', 'city', 'country'],
    });

    if (!talent) {
      return Result.failure(TalentError.ProfileNotFound);
    }

    await this.updateTalent(talent, dto);

    talent.qualityScore = this.scoringService.calculateProfileScore(talent);
    this.handlePromotionUpdate(talent);

    await this.em.flush();

    this.logger.log(
      { talentId: talent.id },
      'talent.update-talent.success: Talent profile updated successfully',
    );

    return Result.success();
  }

  private async updateTalent(
    talent: Talent,
    dto: UpdateTalentRequestDto,
  ): Promise<void> {
    const { city, country } = await this.getLocation(dto.city, dto.countryId);
    const { salaryRange, hourlyRateRange } = this.getCompensationRefs(
      dto.salaryRangeId,
      dto.hourlyRateRangeId,
    );

    const basicProperties: Partial<Talent> = {
      handle: dto.handle,
      fullName: dto.fullName,
      title: dto.title,
      bio: dto.bio,
      avatarUrl: dto.avatarUrl,
      skills: dto.skills,
      email: dto.email,
      phone: dto.phone,
      socialLinks: dto.socialLinks,
    };

    const flagProperties: Partial<Talent> = {
      isPublic: dto.isPublic,
      isAvailable: dto.isAvailable,
      isContactable: dto.isContactable,
      requiresVisaSponsorship: dto.requiresVisaSponsorship,
    };

    const referenceProperties: Partial<Talent> = {
      city,
      country,
      salaryRange,
      hourlyRateRange,
    };

    Object.assign(talent, basicProperties, flagProperties, referenceProperties);

    this.updateWorkPreferences(
      talent,
      dto.locationTypeIds,
      dto.employmentTypeIds,
    );
    this.updateLanguages(talent, dto.languages);
  }

  private getCompensationRefs(
    salaryId?: number,
    hourlyId?: number,
  ): {
    salaryRange?: SalaryRange;
    hourlyRateRange?: HourlyRateRange;
  } {
    return {
      salaryRange: salaryId
        ? this.em.getReference(SalaryRange, salaryId)
        : undefined,
      hourlyRateRange: hourlyId
        ? this.em.getReference(HourlyRateRange, hourlyId)
        : undefined,
    };
  }

  private updateWorkPreferences(
    talent: Talent,
    workLocationTypeIds: number[],
    employmentTypeIds: number[],
  ): void {
    const workLocationTypes = workLocationTypeIds.map((id) =>
      this.em.getReference(WorkLocationType, id),
    );

    const employmentTypes = employmentTypeIds.map((id) =>
      this.em.getReference(EmploymentType, id),
    );

    talent.workLocationTypes.set(workLocationTypes);
    talent.employmentTypes.set(employmentTypes);
  }

  private updateLanguages(
    talent: Talent,
    languages: TalentLanguageDto[],
  ): void {
    const talentLanguages = languages.map((lang) => {
      const language = this.em.getReference(Language, lang.languageId);
      const level = this.em.getReference(LanguageLevel, lang.levelId);
      return new TalentLanguage(language, level);
    });

    talent.languages.set(talentLanguages);
  }

  private async getLocation(
    cityName: string,
    countryId: number,
  ): Promise<{
    city: City;
    country: Country;
  }> {
    const country = this.em.getReference(Country, countryId);

    const slug = slugify(cityName, { lower: true });
    let city = await this.em.findOne(City, { slug, country });

    if (!city) {
      city = this.em.create(City, new City(cityName, slug, country));
    }

    return { city, country };
  }

  private handlePromotionUpdate(talent: Talent): void {
    const now = new Date();
    const canPromote =
      !talent.promotedAt ||
      now.getTime() - talent.promotedAt.getTime() >= this.COOLDOWN_PERIOD;

    if (canPromote) {
      talent.promotedAt = now;
    }
  }
}
