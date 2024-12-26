import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMemberListQuery } from './get-member-list.query';
import { EntityManager, QueryOrder, raw } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
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
      .select([])
      .leftJoinAndSelect('m.country', 'c', {}, ['c.name'])
      .leftJoinAndSelect('m.city', 'ct', {}, ['ct.name'])
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

    /**
     * Calculates weighted score based on:
     * - Base quality score
     * - Activity decay: -0.5 per day, max 90 days
     * - Promotion decay: -0.3 per day, max 90 days
     */
    const scoreFormula = raw(
      `(
      quality_score - 
      LEAST(EXTRACT(EPOCH FROM NOW() - last_active_at) / 86400, 90) * 0.5 - 
      LEAST(EXTRACT(EPOCH FROM NOW() - promoted_at) / 86400, 90) * 0.3
      )`,
    );

    qb.orderBy({
      [scoreFormula]: QueryOrder.DESC,
    })
      .limit(this.pageSizes)
      .offset(this.pageSizes * (page - 1));

    const [members, count] = (await qb.getResultAndCount()) as [
      MemberQueryResult[],
      number,
    ];

    // Map the results to DTOs
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
