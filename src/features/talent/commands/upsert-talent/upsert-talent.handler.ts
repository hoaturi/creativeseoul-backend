import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpsertTalentCommand } from './upsert-talent.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Logger } from '@nestjs/common';
import { Talent } from '../../../../domain/talent/talent.entity';
import { User } from '../../../../domain/user/user.entity';
import { UpsertTalentRequestDto } from '../../dtos/requests/upsert-talent-request.dto';
import { Country } from '../../../../domain/common/entities/country.entity';
import { City } from '../../../../domain/common/entities/city.entity';
import { Language } from '../../../../domain/common/entities/language.entity';
import { TalentLanguage } from '../../../../domain/talent/talent-language.entity';
import { TalentScoringService } from '../../../../infrastructure/services/talent-scoring/talent-scoring.service';
import { TalentLanguageRequestDto } from '../../dtos/requests/talent-language-request.dto';
import { SalaryRange } from '../../../../domain/common/entities/salary-range.entity';
import slugify from 'slugify';
import { HourlyRateRange } from '../../../../domain/common/entities/hourly-rate-range.entity';
import { WorkLocationType } from '../../../../domain/common/entities/work-location-type.entity';
import { EmploymentType } from '../../../../domain/common/entities/employment-type.entity';

@CommandHandler(UpsertTalentCommand)
export class UpsertTalentHandler
  implements ICommandHandler<UpsertTalentCommand>
{
  private readonly logger = new Logger(UpsertTalentHandler.name);
  private readonly COOLDOWN_PERIOD = 14 * 24 * 60 * 60 * 1000;

  public constructor(
    private readonly em: EntityManager,
    private readonly scoringService: TalentScoringService,
  ) {}

  public async execute(
    command: UpsertTalentCommand,
  ): Promise<Result<void, ResultError>> {
    const { dto, user } = command;

    const talent = await this.em.findOne(
      Talent,
      {
        user: user.id,
      },
      {
        populate: ['languages', 'city', 'country'],
      },
    );

    if (!talent) {
      await this.createTalent(user.id, dto);
      return Result.success();
    }

    await this.updateTalent(talent, dto);
    return Result.success();
  }

  private async createTalent(
    userId: string,
    dto: UpsertTalentRequestDto,
  ): Promise<void> {
    const {
      salaryRangeId,
      hourlyRateRangeId,
      locationTypeIds,
      employmentTypeIds,
      countryId,
      city: cityName,
      languages,
      ...talentData
    } = dto;

    const user = this.em.getReference(User, userId);

    const { city, country } = await this.getLocation(cityName, countryId);
    const { salaryRange, hourlyRateRange } = this.getCompensationRefs(
      salaryRangeId,
      hourlyRateRangeId,
    );

    const talent = new Talent(user, {
      ...talentData,
      city,
      country,
      salaryRange,
      hourlyRateRange,
      isAvailable: dto.isAvailable,
      isContactable: dto.isContactable,
      isPublic: dto.isPublic,
      requiresVisaSponsorship: dto.requiresVisaSponsorship,
    });

    this.em.persist(talent);

    this.updateWorkPreferences(talent, locationTypeIds, employmentTypeIds);
    this.updateLanguages(talent, languages);

    talent.qualityScore = this.scoringService.calculateProfileScore(talent);
    this.handlePromotionUpdate(talent);

    await this.em.flush();

    this.logger.log(
      { talentId: talent.id },
      'talent.upsert-talent.success: Talent profile created successfully',
    );
  }

  private async updateTalent(
    talent: Talent,
    dto: UpsertTalentRequestDto,
  ): Promise<void> {
    const {
      salaryRangeId,
      hourlyRateRangeId,
      locationTypeIds,
      employmentTypeIds,
      countryId,
      city: cityName,
      languages,
      ...talentData
    } = dto;

    const { city, country } = await this.getLocation(cityName, countryId);

    const { salaryRange, hourlyRateRange } = this.getCompensationRefs(
      salaryRangeId,
      hourlyRateRangeId,
    );

    const updateData: Partial<Talent> = {
      ...talentData,
      city,
      country,
      salaryRange,
      hourlyRateRange,
      isAvailable: dto.isAvailable,
      isContactable: dto.isContactable,
      isPublic: dto.isPublic,
      requiresVisaSponsorship: dto.requiresVisaSponsorship,
    };

    Object.assign(talent, updateData);

    this.updateWorkPreferences(talent, locationTypeIds, employmentTypeIds);
    this.updateLanguages(talent, languages);

    talent.qualityScore = this.scoringService.calculateProfileScore(talent);
    this.handlePromotionUpdate(talent);

    await this.em.flush();

    this.logger.log(
      { talentId: talent.id },
      'talent.upsert-talent.success: Talent profile updated successfully',
    );
  }

  private getCompensationRefs(
    salaryId?: number,
    hourlyId?: number,
  ): {
    salaryRange?: SalaryRange;
    hourlyRateRange?: HourlyRateRange;
  } {
    const salaryRange = this.em.getReference(SalaryRange, salaryId);
    const hourlyRateRange = this.em.getReference(HourlyRateRange, hourlyId);

    return {
      salaryRange,
      hourlyRateRange,
    };
  }

  private updateWorkPreferences(
    talent: Talent,
    workLocationTypeIds: number[],
    employmentTypeIds: number[],
  ): {
    workLocationTypes: WorkLocationType[];
    employmentTypes: EmploymentType[];
  } {
    const workLocationTypes = workLocationTypeIds.map((id) =>
      this.em.getReference(WorkLocationType, id),
    );

    const employmentTypes = employmentTypeIds.map((id) =>
      this.em.getReference(EmploymentType, id),
    );

    talent.workLocationTypes.set(workLocationTypes);
    talent.employmentTypes.set(employmentTypes);

    return { workLocationTypes, employmentTypes };
  }

  private updateLanguages(
    talent: Talent,
    languages: TalentLanguageRequestDto[],
  ): void {
    const talentLanguages = languages.map((lang) => {
      const language = this.em.getReference(Language, lang.languageId);
      return new TalentLanguage(language, lang.level);
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
    let city = await this.em.findOne(City, { slug: slug, country });

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
