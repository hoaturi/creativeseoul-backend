import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMemberCommand } from './update-member.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Logger } from '@nestjs/common';
import { Language } from '../../../../domain/common/entities/language.entity';
import { UpdateMemberRequestDto } from '../../dtos/update-member-request.dto';
import { City } from '../../../../domain/common/entities/city.entity';
import { Country } from '../../../../domain/common/entities/country.entity';
import slugify from 'slugify';
import { Member } from '../../../../domain/member/member.entity';
import { MemberLanguage } from '../../../../domain/member/member-language.entity';
import { MemberScoringService } from '../../../../infrastructure/services/member-scoring/member-scoring.service';
import { MemberLanguageDto } from '../../dtos/member-language.dto';

@CommandHandler(UpdateMemberCommand)
export class UpdateMemberHandler
  implements ICommandHandler<UpdateMemberCommand>
{
  private readonly logger = new Logger(UpdateMemberHandler.name);
  private readonly COOLDOWN_PERIOD = 3 * 24 * 60 * 60 * 1000;

  public constructor(
    private readonly em: EntityManager,
    private readonly scoringService: MemberScoringService,
  ) {}

  public async execute(
    command: UpdateMemberCommand,
  ): Promise<Result<void, ResultError>> {
    const { dto, userId } = command;

    const member = await this.em.findOne(
      Member,
      { user: userId },
      { populate: ['city', 'country', 'languages'] },
    );

    await this.updateMember(member, dto);
    this.updateLanguages(member, dto.languages);

    member.qualityScore = this.scoringService.calculateProfileScore(member);
    this.handlePromotionUpdate(member);

    await this.em.flush();

    this.logger.log(
      { memberId: member.id },
      'member.member-update.success: Member updated successfully',
    );

    return Result.success();
  }

  private async updateMember(
    member: Member,
    dto: UpdateMemberRequestDto,
  ): Promise<void> {
    const country = dto.countryId
      ? this.em.getReference(Country, dto.countryId)
      : null;

    const city = dto.city
      ? await this.getOrCreateCity(dto.city, country)
      : null;

    member.handle = dto.handle;
    member.fullName = dto.fullName;
    member.title = dto.title;
    member.bio = dto.bio;
    member.avatarUrl = dto.avatarUrl;
    member.city = city;
    member.country = country;
    member.tags = dto.tags;
    member.socialLinks = dto.socialLinks;
  }

  private updateLanguages(
    member: Member,
    languages: MemberLanguageDto[],
  ): void {
    const memberLanguages = languages.map((lang) => {
      const language = this.em.getReference(Language, lang.languageId);
      return new MemberLanguage(member, language, lang.level);
    });

    member.languages.set(memberLanguages);
  }

  private handlePromotionUpdate(member: Member): void {
    const now = new Date();
    const canPromote =
      !member.promotedAt ||
      now.getTime() - member.promotedAt.getTime() >= this.COOLDOWN_PERIOD;

    if (canPromote) {
      member.promotedAt = now;
    }
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
}
