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
import slugify from 'slugify';
import { TalentScoringService } from '../../../../infrastructure/services/talent-scoring/talent-scoring.service';
import { TalentLanguageRequestDto } from '../../dtos/requests/talent-language-request.dto';

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
    const user = this.em.getReference(User, userId);
    const country = this.em.getReference(Country, dto.countryId);
    const city = dto.city
      ? await this.getOrCreateCity(dto.city, country)
      : null;

    const { languages, ...talentData } = dto;

    const talent = new Talent(user, {
      ...talentData,
      city,
      country,
      isAvailable: dto.isAvailable ?? false,
      isContactable: dto.isContactable ?? false,
      isPublic: dto.isPublic ?? false,
      requiresVisaSponsorship: dto.requiresVisaSponsorship ?? false,
      locationTypeIds: dto.locationTypeIds ?? [],
      employmentTypeIds: dto.employmentTypeIds ?? [],
    });

    this.em.persist(talent);

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
    const country = this.em.getReference(Country, dto.countryId);
    const city = dto.city
      ? await this.getOrCreateCity(dto.city, country)
      : null;

    const { languages, ...talentData } = dto;

    Object.assign(talent, {
      ...talentData,
      city,
      country,
      isAvailable: dto.isAvailable ?? talent.isAvailable,
      isContactable: dto.isContactable ?? talent.isContactable,
      isPublic: dto.isPublic ?? talent.isPublic,
      requiresVisaSponsorship:
        dto.requiresVisaSponsorship ?? talent.requiresVisaSponsorship,
      locationTypeIds: dto.locationTypeIds ?? talent.locationTypeIds,
      employmentTypeIds: dto.employmentTypeIds ?? talent.employmentTypeIds,
    });

    this.updateLanguages(talent, languages);

    talent.qualityScore = this.scoringService.calculateProfileScore(talent);
    this.handlePromotionUpdate(talent);

    await this.em.flush();

    this.logger.log(
      { talentId: talent.id },
      'talent.upsert-talent.success: Talent profile updated successfully',
    );
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

  private async getOrCreateCity(
    cityName: string,
    country: Country,
  ): Promise<City> {
    const citySlug = slugify(cityName, { lower: true });
    let city = await this.em.findOne(City, { slug: citySlug });

    if (!city) {
      city = this.em.create(City, new City(cityName, citySlug, country));
    }

    return city;
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
