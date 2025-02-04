import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
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
import slugify from 'slugify';
import { TalentScoringService } from '../../../../infrastructure/services/talent-scoring/talent-scoring.service';
import { TalentError } from '../../talent.error';
import { TalentLanguageDto } from '../../dtos/requests/talent-language.dto';
import { LanguageLevel } from '../../../../domain/common/entities/language-level.entity';
import { CreateTalentCommand } from './create-talent.command';
import { CreateTalentRequestDto } from '../../dtos/requests/create-talent-request.dto';
import { SessionResponseDto } from '../../../auth/dtos/session-response.dto';

interface LocationRefs {
  city?: City;
  country: Country;
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
  ): Promise<Result<SessionResponseDto, ResultError>> {
    const { dto, user } = command;

    if (user.profile.id) {
      return Result.failure(TalentError.ProfileAlreadyExists);
    }

    const existingHandle = await this.em.findOne(Talent, {
      handle: dto.handle,
    });
    if (existingHandle) {
      return Result.failure(TalentError.HandleAlreadyExists);
    }

    const talent = await this.createTalent(dto, user.id);
    this.updateLanguages(talent, dto.languages);

    talent.qualityScore = this.scoringService.calculateProfileScore(talent);

    await this.em.flush();

    this.logger.log(
      { talentId: talent.id },
      'talent.create-talent.success: Talent profile created successfully',
    );

    const response = new SessionResponseDto({
      ...user,
      profile: {
        id: talent.id,
        name: talent.fullName,
        avatarUrl: talent.avatarUrl,
      },
    });
    return Result.success(response);
  }

  private async createTalent(
    dto: CreateTalentRequestDto,
    userId: string,
  ): Promise<Talent> {
    const { countryId, city: cityName, ...talentData } = dto;

    const userRef = this.em.getReference(User, userId);
    const { city, country } = await this.getLocation(countryId, cityName);

    return this.em.create(
      Talent,
      new Talent(userRef, {
        ...talentData,
        city,
        country,
        isAvailable: false,
        isContactable: false,
        requiresVisaSponsorship: false,
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
