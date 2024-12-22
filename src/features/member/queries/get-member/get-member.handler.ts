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
    const { userId, memberId } = query;

    const member = await this.em.findOne(Member, memberId, {
      populate: ['country.name', 'city.name', 'languages'],
    });

    if (!member) {
      return Result.failure(MemberError.NotFound);
    }

    if (!member.isPublic && member.user.id !== userId) {
      return Result.failure(MemberError.NotAvailable);
    }

    const memberLocation = new LocationDto(
      member.country.name,
      member.city?.name,
    );

    const memberLanguages = member.languages.map((language) => {
      return new LanguageWithLevelDto(language.language.name, language.level);
    });

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
