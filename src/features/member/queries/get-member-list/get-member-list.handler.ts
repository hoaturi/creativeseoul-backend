import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EntityManager, Loaded, QueryOrder, raw } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import {
  GetMemberListResponseDto,
  MemberListItemDto,
} from '../../dtos/responses/get-member-list-response.dto';
import { MemberLocationResponseDto } from '../../../common/dtos/member-location-response.dto';
import { Member } from '../../../../domain/member/member.entity';
import { GetMemberListQuery } from './get-member-list.query';

const MEMBER_FIELDS = [
  'handle',
  'fullName',
  'title',
  'avatarUrl',
  'tags',
  'country.name',
  'city.name',
] as const;

type MemberFields = (typeof MEMBER_FIELDS)[number];
type LoadedMember = Loaded<Member, never, MemberFields>;

@QueryHandler(GetMemberListQuery)
export class GetMemberListHandler implements IQueryHandler<GetMemberListQuery> {
  private static readonly PAGE_SIZE = 20;
  private static readonly MIN_QUALITY_SCORE = 40;

  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetMemberListQuery,
  ): Promise<Result<GetMemberListResponseDto, ResultError>> {
    const { search, countryId, page = 1 } = query.dto;

    const where = {
      qualityScore: { $gt: GetMemberListHandler.MIN_QUALITY_SCORE },
    } as any;

    if (search) {
      const formattedSearch = search
        .split(' ')
        .map((word) => word.trim())
        .join(' & ');
      where.searchVector = { $fulltext: formattedSearch };
    }

    if (countryId) {
      where.country_id = countryId;
    }

    const priorityTier = raw(`
      CASE
        WHEN m0.promoted_at > NOW() - INTERVAL '14 days'
        AND m0.last_active_at > NOW() - INTERVAL '24 hours'
        AND m0.quality_score >= 80
        THEN 3

        WHEN m0.quality_score >= 80 
        AND (
          m0.promoted_at > NOW() - INTERVAL '14 days'
          OR m0.last_active_at > NOW() - INTERVAL '24 hours'
        )
        THEN 2

        WHEN m0.promoted_at > NOW() - INTERVAL '14 days'
        OR m0.last_active_at > NOW() - INTERVAL '24 hours'
        THEN 1

        ELSE 0
      END
    `);

    const [members, count] = await this.em.findAndCount(Member, where, {
      fields: MEMBER_FIELDS,
      orderBy: {
        [priorityTier]: QueryOrder.DESC,
        qualityScore: QueryOrder.DESC,
        lastActiveAt: QueryOrder.DESC,
      },
      limit: GetMemberListHandler.PAGE_SIZE,
      offset: GetMemberListHandler.PAGE_SIZE * (page - 1),
    });

    const memberDtos = this.mapToMemberDtos(members);
    return Result.success(new GetMemberListResponseDto(memberDtos, count));
  }

  private mapToMemberDtos(members: LoadedMember[]): MemberListItemDto[] {
    return members.map((member) => {
      const location = new MemberLocationResponseDto(
        member.country.name,
        member.city?.name,
      );

      return new MemberListItemDto({
        handle: member.handle,
        fullName: member.fullName,
        title: member.title,
        avatarUrl: member.avatarUrl,
        tags: member.tags,
        location,
      });
    });
  }
}
