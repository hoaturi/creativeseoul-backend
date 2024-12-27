import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMemberQuery } from './get-member-query';
import { GetMemberResponseDto } from '../../dtos/responses/get-member-response.dto';
import { MemberError } from '../../member.error';
import { ResultError } from '../../../../common/result/result-error';
import { Result } from '../../../../common/result/result';
import { MemberLanguageProficiencyResponseDto } from '../../../common/dtos/member-language-proficiency-response.dto';
import { MemberLocationResponseDto } from '../../../common/dtos/member-location-response.dto';
import { MemberSocialLinksResponseDto } from '../../dtos/responses/member-social-links-response.dto';
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
        fields: [
          'handle',
          'fullName',
          'title',
          'bio',
          'avatarUrl',
          'tags',
          'socialLinks',
          'professional.isOpenToWork',
        ],
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
          new MemberLanguageProficiencyResponseDto(
            lang.language.name,
            lang.level,
          ),
      );

    const location = new MemberLocationResponseDto(
      member.country.name,
      member.city?.name,
    );

    const socialLinks = member.socialLinks
      ? new MemberSocialLinksResponseDto(member.socialLinks)
      : undefined;

    return Result.success(
      new GetMemberResponseDto({
        handle: member.handle,
        fullName: member.fullName,
        title: member.title,
        bio: member.bio,
        avatarUrl: member.avatarUrl,
        tags: member.tags?.length ? member.tags : undefined,
        isOpenToWork: member.professional?.isOpenToWork,
        languages,
        location,
        socialLinks,
      }),
    );
  }
}
