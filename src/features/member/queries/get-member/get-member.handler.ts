import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';
import { GetMemberQuery } from './get-member.query';
import { Result } from '../../../../common/result/result';
import { GetMemberResponseDto } from '../../dtos/get-member-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { Member } from '../../../../domain/member/member.entity';
import { MemberError } from '../../member.error';
import { LanguageWithLevelDto } from '../../../common/dtos/language-with-level.dto';
import { LocationDto } from '../../../common/dtos/location.dto';

@QueryHandler(GetMemberQuery)
export class GetMemberHandler implements IQueryHandler<GetMemberQuery> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetMemberQuery,
  ): Promise<Result<GetMemberResponseDto, ResultError>> {
    const { id } = query;

    const member = await this.em.findOne(Member, id, {
      populate: [
        'fullName',
        'title',
        'bio',
        'avatarUrl',
        'country.name',
        'city.name',
        'languages.level',
        'languages.language.name',
      ],
    });

    if (!member) {
      return Result.failure(MemberError.NotFound);
    }

    const memberLocation = new LocationDto(
      member.country.name,
      member.city?.name,
    );

    const memberLanguages = member.languages.map((language) => {
      return new LanguageWithLevelDto(language.language.name, language.level);
    });

    console.log(memberLanguages);

    return Result.success(
      new GetMemberResponseDto(
        member.fullName,
        member.title,
        member.bio,
        memberLocation,
        memberLanguages,
        member.avatarUrl,
      ),
    );
  }
}
