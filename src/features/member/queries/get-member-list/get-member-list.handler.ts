import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMemberListQuery } from './get-member-list.query';
import { EntityManager, QueryOrder, raw } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import {
  GetMemberListResponseDto,
  MemberListItemDto,
} from '../../dtos/responses/get-member-list-response.dto';
import { LocationResponseDto } from '../../../common/dtos/location-response.dto';
import { Member } from '../../../../domain/member/member.entity';

interface MemberQueryResult {
  id: string;
  handle: string;
  fullName: string;
  title: string;
  avatarUrl?: string;
  tags?: string[];
  country: {
    name: string;
  };
  city?: {
    name: string;
  };
}

@QueryHandler(GetMemberListQuery)
export class GetMemberListHandler implements IQueryHandler<GetMemberListQuery> {
  private readonly pageSizes = 20;

  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetMemberListQuery,
  ): Promise<Result<GetMemberListResponseDto, ResultError>> {
    const { search, countryId } = query.dto;
    const page = query.dto.page || 1;

    const qb = this.em
      .createQueryBuilder(Member, 'm')
      .select([
        'm.id',
        'm.handle',
        'm.full_name as fullName',
        'm.title',
        'm.avatar_url as avatarUrl',
        'm.tags',
      ])
      .leftJoinAndSelect('m.country', 'c')
      .leftJoinAndSelect('m.city', 'ct')
      .where({ qualityScore: { $gt: 40 } });

    if (search) {
      const formattedSearch = search
        .split(' ')
        .map((word) => word.trim())
        .join(' & ');
      qb.andWhere({ searchVector: { $fulltext: formattedSearch } });
    }

    if (countryId) {
      qb.andWhere({ country_id: countryId });
    }

    const priorityTier = raw(`
      CASE 
        /* High quality + Recently updated + Active: Best case */
        WHEN m.promoted_at > NOW() - INTERVAL '14 days'
        AND m.last_active_at > NOW() - INTERVAL '24 hours'
        AND m.quality_score >= 80
        THEN 3
    
        /* High quality + Either updated or active */
        WHEN m.quality_score >= 80 
        AND (
          m.promoted_at > NOW() - INTERVAL '14 days'
          OR m.last_active_at > NOW() - INTERVAL '24 hours'
        )
        THEN 2
        
        /* Recently updated or active */
        WHEN m.promoted_at > NOW() - INTERVAL '14 days'
        OR m.last_active_at > NOW() - INTERVAL '24 hours'
        THEN 1
        
        ELSE 0 
      END
    `);

    qb.orderBy({
      [priorityTier]: QueryOrder.DESC,
      'm.quality_score': QueryOrder.DESC,
      'm.last_active_at': QueryOrder.DESC,
    })
      .limit(this.pageSizes)
      .offset(this.pageSizes * (page - 1));

    const [members, count] = (await qb.getResultAndCount()) as [
      MemberQueryResult[],
      number,
    ];

    const memberDtos = members.map((member) => {
      const location = new LocationResponseDto(
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

    return Result.success(new GetMemberListResponseDto(memberDtos, count));
  }
}
