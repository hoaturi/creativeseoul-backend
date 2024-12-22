import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMemberCommand } from './update-member.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Logger } from '@nestjs/common';
import { CustomException } from '../../../../common/exceptions/custom.exception';
import { UserErrorCode } from '../../../../domain/user/user-error-code.enum';
import { User } from '../../../../domain/user/user.entity';
import { LanguageDto } from '../../dtos/create-member-request.dto';
import { Language } from '../../../../domain/common/entities/language.entity';
import { UpdateMemberRequestDto } from '../../dtos/update-member-request.dto';
import { City } from '../../../../domain/common/entities/city.entity';
import { Country } from '../../../../domain/common/entities/country.entity';
import slugify from 'slugify';
import { MemberError } from '../../member.error';
import { Member } from '../../../../domain/member/member.entity';
import { MemberLanguage } from '../../../../domain/member/member-language.entity';

@CommandHandler(UpdateMemberCommand)
export class UpdateMemberHandler
  implements ICommandHandler<UpdateMemberCommand>
{
  private readonly logger = new Logger(UpdateMemberHandler.name);

  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: UpdateMemberCommand,
  ): Promise<Result<void, ResultError>> {
    const { dto, userId } = command;

    const [, member] = await Promise.all([
      this.validateUser(userId),
      this.findMember(userId),
    ]);

    if (!member) {
      return Result.failure(MemberError.NotFound);
    }

    await this.updateMember(member, dto);
    this.updateLanguages(member, dto.languages);

    await this.em.flush();

    this.logger.log(
      {
        memberId: member.id,
      },
      'member.member-update.success: Member updated successfully',
    );

    return Result.success();
  }

  private async validateUser(userId: string): Promise<void> {
    const user = await this.em.findOne(User, { id: userId });

    if (!user) {
      throw new CustomException(
        UserErrorCode.USER_NOT_FOUND,
        { userId },
        'member.member-update.failed: User not found',
      );
    }
  }

  private async findMember(userId: string): Promise<Member | null> {
    return this.em.findOne(
      Member,
      { user: userId },
      {
        populate: ['city', 'country', 'languages'],
      },
    );
  }

  private async updateMember(
    member: Member,
    dto: UpdateMemberRequestDto,
  ): Promise<void> {
    const country = dto.countryId
      ? this.em.getReference(Country, dto.countryId)
      : undefined;

    const city =
      dto.city === ''
        ? null
        : dto.city
          ? await this.getOrCreateCity(dto.city, country)
          : undefined;

    const updates: Partial<Member> = {
      fullName: dto.fullName,
      title: dto.title,
      bio: dto.bio,
      isPublic: dto.isPublic,
      avatarUrl: dto.avatarUrl,
      city,
      country,
    };

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        member[key] = value;
      }
    });
  }

  private updateLanguages(member: Member, languages: LanguageDto[] = []): void {
    if (!languages.length) {
      return;
    }

    const memberLanguages = languages.map((lang) => {
      const language = this.em.getReference(Language, lang.languageId);
      return new MemberLanguage(member, language, lang.level);
    });

    member.languages.set(memberLanguages);
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
