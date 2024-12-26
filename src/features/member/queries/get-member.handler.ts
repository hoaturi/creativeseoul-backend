import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMemberQuery } from './get-member-query';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { GetMemberResponseDto } from '../dtos/responses/get-member-response.dto';
import { Member } from '../../../domain/member/member.entity';
import { MemberError } from '../member.error';

@QueryHandler(GetMemberQuery)
export class GetMemberHandler implements IQueryHandler<GetMemberQuery> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetMemberQuery,
  ): Promise<Result<GetMemberResponseDto, ResultError>> {
    const member = await this.em.findOne(
      Member,
      {
        handle: query.handle,
      },
      {
        populate: ['languages', 'city', 'country'],
      },
    );

    if (!member) {
      return Result.failure(MemberError.NotFound);
    }

    return Result.success(new GetMemberResponseDto(member));
  }
}
