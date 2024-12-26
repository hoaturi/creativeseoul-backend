import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMemberQuery } from './get-member-query';
import { GetMemberResponseDto } from '../../dtos/responses/get-member-response.dto';
import { MemberError } from '../../member.error';
import { ResultError } from '../../../../common/result/result-error';
import { Result } from '../../../../common/result/result';
import { LanguageProficiencyResponseDto } from '../../../common/dtos/language-proficiency-response.dto';
import { LocationResponseDto } from '../../../common/dtos/location-response.dto';
import { SocialLinksResponseDto } from '../../dtos/responses/social-links-response.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Member } from '../../../../domain/member/member.entity';

@QueryHandler(GetMemberQuery)
export class GetMemberHandler implements IQueryHandler<GetMemberQuery> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetMemberQuery,
  ): Promise<Result<GetMemberResponseDto, ResultError>> {
    const member = await this.em.findOne(
      Member,
      { handle: query.handle },
      {
        populate: ['professional.isOpenToWork', 'languages', 'city', 'country'],
      },
    );

    if (!member) {
      return Result.failure(MemberError.NotFound);
    }

    const languages = member.languages
      .getItems()
      .map(
        (lang) =>
          new LanguageProficiencyResponseDto(lang.language.name, lang.level),
      );

    const location = new LocationResponseDto(
      member.country.name,
      member.city?.name,
    );

    const socialLinks = member.socialLinks
      ? new SocialLinksResponseDto(member.socialLinks)
      : undefined;

    return Result.success(
      new GetMemberResponseDto({
        handle: member.handle,
        fullName: member.fullName,
        title: member.title,
        bio: member.bio,
        avatarUrl: member.avatarUrl,
        tags: member.tags,
        isOpenToWork: member.professional?.isOpenToWork,
        languages,
        location,
        socialLinks,
      }),
    );
  }
}
