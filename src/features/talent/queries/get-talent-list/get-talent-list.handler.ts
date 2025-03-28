import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTalentListQuery } from './get-talent-list.query';
import {
  EntityManager,
  Loaded,
  QBFilterQuery,
  QueryOrder,
  raw,
} from '@mikro-orm/postgresql';
import { Talent } from '../../../../domain/talent/entities/talent.entity';

import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import {
  GetTalentListItemDto,
  GetTalentListResponseDto,
} from '../../dtos/responses/get-talent-list-response.dto';
import { GetTalentListQueryDto } from '../../dtos/requests/get-talent-list-query.dto';
import { AvailabilityStatusId } from '../../../../domain/talent/constants/availability-status.constant';

const TALENT_FIELDS = [
  'handle',
  'fullName',
  'title',
  'bio',
  'avatarUrl',
  'availabilityStatus.label',
  'requiresVisaSponsorship',
  'skills',
  'qualityScore',
  'promotedAt',
  'lastActiveAt',
  'country.label',
  'city.label',
] as const;

type TalentFields = (typeof TALENT_FIELDS)[number];
type LoadedTalent = Loaded<Talent, never, TalentFields>;

@QueryHandler(GetTalentListQuery)
export class GetTalentListHandler implements IQueryHandler<GetTalentListQuery> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetTalentListQuery,
  ): Promise<Result<GetTalentListResponseDto, ResultError>> {
    const { page = 1, limit = 20 } = query.dto;

    const where: QBFilterQuery<Talent> = {
      qualityScore: { $gte: 40 },
      availabilityStatus: { $ne: AvailabilityStatusId.NOT_LOOKING },
    };

    this.applyFilters(where, query.dto);

    const priorityTier = raw(`
      CASE
        WHEN promoted_at > NOW() - INTERVAL '14 days'
         AND last_active_at > NOW() - INTERVAL '24 hours'
          AND quality_score >= 80 THEN 3
        WHEN quality_score >= 80
         AND (promoted_at > NOW() - INTERVAL '14 days'
          OR last_active_at > NOW() - INTERVAL '24 hours') THEN 2
        WHEN promoted_at > NOW() - INTERVAL '14 days'
          OR last_active_at > NOW() - INTERVAL '24 hours' THEN 1
        ELSE 0
      END
    `);

    const [talents, count] = await this.em.findAndCount(Talent, where, {
      fields: TALENT_FIELDS,
      orderBy: {
        [priorityTier]: QueryOrder.desc,
        lastActiveAt: QueryOrder.desc,
      },
      limit: limit,
      offset: limit * (page - 1),
    });

    const talentDtos = this.mapToTalentDtos(talents);
    return Result.success(new GetTalentListResponseDto(talentDtos, count));
  }

  private applyFilters(
    where: QBFilterQuery<Talent>,
    filters: GetTalentListQueryDto,
  ): void {
    const { search, employmentTypeIds, workLocationTypeIds } = filters;

    if (search) {
      where.searchVector = { $fulltext: search };
    }

    if (employmentTypeIds?.length) {
      where.employmentTypes = { $some: { id: { $in: employmentTypeIds } } };
    }

    if (workLocationTypeIds?.length) {
      where.workLocationTypes = { $some: { id: { $in: workLocationTypeIds } } };
    }
  }

  private mapToTalentDtos(talents: LoadedTalent[]): GetTalentListItemDto[] {
    return talents.map(
      (talent) =>
        new GetTalentListItemDto({
          handle: talent.handle,
          fullName: talent.fullName,
          title: talent.title,
          bio: talent.bio,
          avatarUrl: talent.avatarUrl,
          location: {
            country: talent.country.label,
            city: talent.city?.label,
          },
          availabilityStatus: talent.availabilityStatus.label,
          requiresVisaSponsorship: talent.requiresVisaSponsorship,
          skills: talent.skills,
        }),
    );
  }
}
