import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';
import { CreateMemberCommand } from './create-member.command';
import { User } from '../../../../domain/user/user.entity';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { CustomException } from '../../../../common/exceptions/custom.exception';
import { UserErrorCode } from '../../../../domain/user/user-error-code.enum';
import { CreateMemberRequestDto } from '../../dtos/create-member-request.dto';
import { Logger } from '@nestjs/common';
import { City } from '../../../../domain/common/entities/city.entity';
import { Country } from '../../../../domain/common/entities/country.entity';
import slugify from 'slugify';
import { Language } from '../../../../domain/common/entities/language.entity';
import { MemberLanguage } from '../../../../domain/member/member-language.entity';
import { Member } from '../../../../domain/member/member.entity';
import { MemberError } from '../../member.error';
import { MemberScoringService } from '../../../../infrastructure/services/member-scoring/member-scoring.service';

@CommandHandler(CreateMemberCommand)
export class CreateMemberHandler
  implements ICommandHandler<CreateMemberCommand>
{
  private readonly logger = new Logger(CreateMemberHandler.name);

  public constructor(
    private readonly em: EntityManager,
    private readonly scoringService: MemberScoringService,
  ) {}

  public async execute(
    command: CreateMemberCommand,
  ): Promise<Result<void, ResultError>> {
    const { dto, userId } = command;

    const [user, hasExistingProfile] = await Promise.all([
      this.validateUser(userId),
      this.checkExistingProfile(userId),
    ]);

    if (hasExistingProfile) {
      return Result.failure(MemberError.AlreadyExists);
    }

    const member = await this.createMember(user, dto);

    const score = this.scoringService.calculateProfileScore(member);

    console.log(score);

    member.qualityScore = score;
    member.promotedAt = new Date();

    await this.em.flush();

    this.logger.log(
      { userId: user.id, memberId: member.id },
      'member.create-member.success: Member profile created successfully',
    );

    return Result.success();
  }

  private async validateUser(userId: string): Promise<User> {
    const user = await this.em.findOne(User, { id: userId });
    if (!user) {
      throw new CustomException(
        UserErrorCode.USER_NOT_FOUND,
        { userId },
        'member.create-member.failed: User not found',
      );
    }
    return user;
  }

  private async checkExistingProfile(userId: string): Promise<boolean> {
    const existingProfile = await this.em.findOne(
      Member,
      { user: { id: userId } },
      { fields: ['id'] },
    );
    return !!existingProfile;
  }

  private async createMember(
    user: User,
    dto: CreateMemberRequestDto,
  ): Promise<Member> {
    const country = this.em.getReference(Country, dto.countryId);
    const city = await this.findOrCreateCity(dto.city, country);

    const member = this.em.create(
      Member,
      new Member(
        user,
        dto.fullName,
        city,
        country,
        dto.title,
        dto.bio,
        dto.avatarUrl,
        dto.tags,
      ),
    );

    const memberLanguages = dto.languages.map((language) => {
      const languageRef = this.em.getReference(Language, language.languageId);
      return new MemberLanguage(member, languageRef, language.level);
    });

    member.languages.add(memberLanguages);
    return member;
  }

  private async findOrCreateCity(
    cityName: string,
    country: Country,
  ): Promise<City | null> {
    if (!cityName) return null;

    const citySlug = slugify(cityName, { lower: true });
    let city = await this.em.findOne(City, { slug: citySlug });

    if (!city) {
      city = this.em.create(City, new City(cityName, citySlug, country));
    }

    return city;
  }
}
