import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTalentAsMemberListQuery } from './get-talent-as-member-list.query';
import { EntityManager, FilterQuery, raw } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import {
  GetTalentAsMemberItemDto,
  GetTalentAsMemberListResponseDto,
} from '../../dtos/responses/get-talent-as-member-list-response.dto';
import { Talent } from '../../../../domain/talent/entities/talent.entity';
import { TalentLocationDto } from '../../dtos/responses/talent-location.dto';
import { TalentSocialLinksDto } from '../../dtos/responses/talent-social-links.dto';

@QueryHandler(GetTalentAsMemberListQuery)
export class GetTalentAsMemberListHandler
  implements IQueryHandler<GetTalentAsMemberListQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetTalentAsMemberListQuery,
  ): Promise<Result<GetTalentAsMemberListResponseDto, ResultError>> {
    const { page = 1, search } = query;

    const memberActivityScore = raw(`
      CASE
        WHEN last_active_at > NOW() - INTERVAL '24 hours' THEN 2
        WHEN last_active_at > NOW() - INTERVAL '7 days' THEN 1
        ELSE 0
      END
    `);

    const whereConditions: FilterQuery<Talent> = {};

    if (search) {
      whereConditions.searchVector = { $fulltext: search };
    }

    const talents = await this.em.find(Talent, whereConditions, {
      fields: [
        'handle',
        'fullName',
        'title',
        'avatarUrl',
        'city.label',
        'country.label',
        'socialLinks',
      ],
      orderBy: { [memberActivityScore]: 'DESC' },
      limit: 50,
      offset: (page - 1) * 50,
    });

    const responseDto = talents.map((talent) => {
      const location = new TalentLocationDto(
        talent.country.label,
        talent.city?.label,
      );

      const socialLinks = talent.socialLinks
        ? new TalentSocialLinksDto(talent.socialLinks)
        : undefined;

      return new GetTalentAsMemberItemDto({
        handle: talent.handle,
        fullName: talent.fullName,
        title: talent.title,
        avatarUrl: talent.avatarUrl,
        location,
        socialLinks,
      });
    });

    return Result.success(new GetTalentAsMemberListResponseDto(responseDto));
  }
}
