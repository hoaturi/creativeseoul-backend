import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTalentAsMemberListQuery } from './get-talent-as-member-list.query';
import { EntityManager, raw } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import {
  GetTalentAsMemberItemDto,
  GetTalentAsMemberListResponseDto,
} from '../../dtos/responses/get-talent-as-member-list-response.dto';
import { Talent } from '../../../../domain/talent/talent.entity';
import { TalentLocationResponseDto } from '../../dtos/responses/talent-location-response.dto';

@QueryHandler(GetTalentAsMemberListQuery)
export class GetTalentAsMemberListHandler
  implements IQueryHandler<GetTalentAsMemberListQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetTalentAsMemberListQuery,
  ): Promise<Result<GetTalentAsMemberListResponseDto, ResultError>> {
    const { page = 1 } = query;

    const memberActivityScore = raw(`
      CASE
        WHEN last_active_at > NOW() - INTERVAL '24 hours' THEN 2
        WHEN last_active_at > NOW() - INTERVAL '7 days' THEN 1
        ELSE 0
      END
    `);

    const talents = await this.em.find(
      Talent,
      {},
      {
        fields: [
          'handle',
          'fullName',
          'title',
          'avatarUrl',
          'city.label',
          'country.label',
        ],
        orderBy: { [memberActivityScore]: 'DESC' },
        limit: 50,
        offset: (page - 1) * 50,
      },
    );

    const responseDto = talents.map((talent) => {
      const location = new TalentLocationResponseDto(
        talent.country.label,
        talent.city.label,
      );

      return new GetTalentAsMemberItemDto({
        handle: talent.handle,
        fullName: talent.fullName,
        title: talent.title,
        avatarUrl: talent.avatarUrl,
        location,
      });
    });

    return Result.success(new GetTalentAsMemberListResponseDto(responseDto));
  }
}
