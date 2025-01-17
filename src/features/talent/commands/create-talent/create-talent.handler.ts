import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTalentCommand } from './create-talent.command';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { EntityManager } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import { Talent } from '../../../../domain/talent/entities/talent.entity';
import { User } from '../../../../domain/user/user.entity';
import { Country } from '../../../../domain/common/entities/country.entity';
import { City } from '../../../../domain/common/entities/city.entity';
import { Language } from '../../../../domain/common/entities/language.entity';
import { TalentLanguage } from '../../../../domain/talent/entities/talent-language.entity';
import { SalaryRange } from '../../../../domain/talent/entities/salary-range.entity';
import { HourlyRateRange } from '../../../../domain/talent/entities/hourly-rate-range.entity';
import { WorkLocationType } from '../../../../domain/common/entities/work-location-type.entity';
import { EmploymentType } from '../../../../domain/common/entities/employment-type.entity';
import slugify from 'slugify';
import { TalentScoringService } from '../../../../infrastructure/services/talent-scoring/talent-scoring.service';
import { TalentError } from '../../talent.error';
import { TalentLanguageDto } from '../../dtos/requests/talent-language.dto';
import { LanguageLevel } from '../../../../domain/common/entities/language-level.entity';
import { CreateTalentRequestDto } from '../../dtos/requests/create-talent-request.dto';

interface LocationRefs {
  city?: City;
  country: Country;
}

interface CompensationRefs {
  salaryRange?: SalaryRange;
  hourlyRateRange?: HourlyRateRange;
}

@CommandHandler(CreateTalentCommand)
export class CreateTalentHandler
  implements ICommandHandler<CreateTalentCommand>
{
  private readonly logger = new Logger(CreateTalentHandler.name);

  public constructor(
    private readonly em: EntityManager,
    private readonly scoringService: TalentScoringService,
  ) {}

  public async execute(
    command: CreateTalentCommand,
  ): Promise<Result<string, ResultError>> {
    const { dto, user } = command;

    if (user.profileId) {
      return Result.failure(TalentError.ProfileAlreadyExists);
    }

    const talent = await this.createTalent(dto, user.id);

    this.updateWorkPreferences(
      talent,
      dto.locationTypeIds,
      dto.employmentTypeIds,
    );
    this.updateLanguages(talent, dto.languages);

    talent.qualityScore = this.scoringService.calculateProfileScore(talent);

    await this.em.flush();

    this.logger.log(
      { talentId: talent.id },
      'talent.create-talent.success: Talent profile created successfully',
    );

    return Result.success(talent.id);
  }

  private async createTalent(
    dto: CreateTalentRequestDto,
    userId: string,
  ): Promise<Talent> {
    const {
      salaryRangeId,
      hourlyRateRangeId,
      countryId,
      city: cityName,
      ...talentData
    } = dto;

    const userRef = this.em.getReference(User, userId);
    const { city, country } = await this.getLocation(countryId, cityName);
    const { salaryRange, hourlyRateRange } = this.getCompensationRefs(
      salaryRangeId,
      hourlyRateRangeId,
    );

    return this.em.create(
      Talent,
      new Talent(userRef, {
        ...talentData,
        city,
        country,
        salaryRange,
        hourlyRateRange,
      }),
    );
  }

  private async getLocation(
    countryId: number,
    cityName?: string,
  ): Promise<LocationRefs> {
    const country = this.em.getReference(Country, countryId);

    if (!cityName) {
      return { country };
    }

    const slug = slugify(cityName, { lower: true });

    let city = await this.em.findOne(City, { slug, country });
    if (!city) {
      city = this.em.create(City, new City(cityName, slug, country));
    }

    return { city, country };
  }

  private getCompensationRefs(
    salaryId?: number,
    hourlyId?: number,
  ): CompensationRefs {
    const salaryRange = salaryId
      ? this.em.getReference(SalaryRange, salaryId)
      : undefined;
    const hourlyRateRange = hourlyId
      ? this.em.getReference(HourlyRateRange, hourlyId)
      : undefined;

    return { salaryRange, hourlyRateRange };
  }

  private updateWorkPreferences(
    talent: Talent,
    locationTypeIds: number[],
    employmentTypeIds: number[],
  ): void {
    const workLocationTypes = locationTypeIds.map((id) =>
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
}
