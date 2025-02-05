import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTalentCommand } from './update-talent.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Logger } from '@nestjs/common';
import { Talent } from '../../../../domain/talent/entities/talent.entity';
import { UpdateTalentRequestDto } from '../../dtos/requests/update-talent-request.dto';
import { Country } from '../../../../domain/common/entities/country.entity';
import { City } from '../../../../domain/common/entities/city.entity';
import { Language } from '../../../../domain/common/entities/language.entity';
import { TalentLanguage } from '../../../../domain/talent/entities/talent-language.entity';
import { TalentScoringService } from '../../../../infrastructure/services/talent-scoring/talent-scoring.service';
import { TalentLanguageDto } from '../../dtos/requests/talent-language.dto';
import slugify from 'slugify';
import { LanguageLevel } from '../../../../domain/common/entities/language-level.entity';
import { TalentError } from '../../talent.error';
import { SessionResponseDto } from '../../../auth/dtos/session-response.dto';

interface LocationRefs {
  city?: City;
  country: Country;
}

@CommandHandler(UpdateTalentCommand)
export class UpdateTalentHandler
  implements ICommandHandler<UpdateTalentCommand>
{
  private readonly logger = new Logger(UpdateTalentHandler.name);
  private readonly COOLDOWN_PERIOD = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

  public constructor(
    private readonly em: EntityManager,
    private readonly scoringService: TalentScoringService,
  ) {}

  public async execute(
    command: UpdateTalentCommand,
  ): Promise<Result<SessionResponseDto, ResultError>> {
    const { dto, user } = command;

    const talent = await this.em.findOne(
      Talent,
      {
        id: user.profile.id,
      },
      {
        populate: ['languages', 'city', 'country'],
      },
    );

    if (!talent) {
      return Result.failure(TalentError.ProfileNotFound);
    }

    const existingTalent = await this.em.findOne(
      Talent,
      {
        handle: dto.handle,
        id: { $ne: user.profile.id },
      },
      {
        fields: ['id'],
      },
    );

    if (existingTalent) {
      return Result.failure(TalentError.HandleAlreadyExists);
    }

    await this.updateTalent(talent, dto);

    talent.qualityScore = this.scoringService.calculateProfileScore(talent);
    this.handlePromotionUpdate(talent);

    await this.em.flush();

    this.logger.log(
      { talentId: talent.id },
      'talent.update-talent.success: Talent profile updated successfully',
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

  private async updateTalent(
    talent: Talent,
    dto: UpdateTalentRequestDto,
  ): Promise<void> {
    const { city, country } = await this.getLocation(dto.countryId, dto.city);

    talent.handle = dto.handle;
    talent.fullName = dto.fullName;
    talent.title = dto.title;
    talent.bio = dto.bio;
    talent.avatarUrl = dto.avatarUrl;
    talent.skills = dto.skills;
    talent.socialLinks = dto.socialLinks;
    talent.city = city;
    talent.country = country;

    this.updateLanguages(talent, dto.languages);
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
