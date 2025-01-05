import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfessionalListQuery } from './get-professional-list.query';

import {
  EntityManager,
  Loaded,
  QBFilterQuery,
  QueryOrder,
  raw,
} from '@mikro-orm/postgresql';
import { Professional } from '../../../../domain/professional/professional.entity';
import {
  GetProfessionalListResponseDto,
  ProfessionalListItemDto,
} from '../../dtos/responses/get-professional-list-response.dto';
import { GetProfessionalListQueryDto } from '../../dtos/requests/get-professional-list-query.dto';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';

const PROFESSIONAL_FIELDS = [
  'isOpenToWork',
  'requiresVisaSponsorship',
  'skills',
  'member.handle',
  'member.fullName',
  'member.title',
  'member.bio',
  'member.avatarUrl',
  'member.city.name',
  'member.country.name',
] as const;

type ProfessionalFields = (typeof PROFESSIONAL_FIELDS)[number];
type LoadedProfessional = Loaded<Professional, never, ProfessionalFields>;

@QueryHandler(GetProfessionalListQuery)
export class GetProfessionalListHandler
  implements IQueryHandler<GetProfessionalListQuery>
{
  private readonly PAGE_SIZE = 20;

  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetProfessionalListQuery,
  ): Promise<Result<any, ResultError>> {
    const { page = 1 } = query.dto;

    const where: QBFilterQuery<Professional> = {
      isPublic: true,
      member: {
        qualityScore: { $gte: 40 },
      },
    };

    this.applyFilters(where, query.dto);

    const priorityTier = raw(`
      CASE
        WHEN m1.promoted_at > NOW() - INTERVAL '14 days'
         AND m1.last_active_at > NOW() - INTERVAL '24 hours'
          AND m1.quality_score >= 80 THEN 3
        WHEN m1.quality_score >= 80
         AND (m1.promoted_at > NOW() - INTERVAL '14 days' 
          OR m1.last_active_at > NOW() - INTERVAL '24 hours') THEN 2
        WHEN m1.promoted_at > NOW() - INTERVAL '14 days' 
          OR m1.last_active_at > NOW() - INTERVAL '24 hours' THEN 1
        ELSE 0
      END
    `);

    const [professionals, count] = await this.em.findAndCount(
      Professional,
      where,
      {
        populateWhere: { member: { country: {}, city: {} } },
        fields: PROFESSIONAL_FIELDS,
        orderBy: {
          [priorityTier]: QueryOrder.desc,
        },
        limit: this.PAGE_SIZE,
        offset: this.PAGE_SIZE * (page - 1),
      },
    );

    const professionalDtos = this.mapToProfessionalDtos(professionals);
    return Result.success(
      new GetProfessionalListResponseDto(professionalDtos, count),
    );
  }

  private applyFilters(
    where: QBFilterQuery<Professional>,
    filters: GetProfessionalListQueryDto,
  ) {
    const {
      search,
      countryId,
      employmentTypeIds,
      locationTypeIds,
      isOpenToWork,
    } = filters;

    if (search) {
      const formattedSearch = search
        .split(' ')
        .map((word) => word.trim())
        .join(' & ');
      where.$and = [
        { searchVector: { $fulltext: formattedSearch } },
        {
          member: {
            searchVector: {
              $fulltext: formattedSearch,
            },
          },
        },
      ];
    }

    if (countryId) {
      where.member.country = { id: countryId };
    }

    if (employmentTypeIds?.length) {
      where.employmentTypeIds = { $contains: employmentTypeIds };
    }

    if (locationTypeIds?.length) {
      where.locationTypeIds = { $contains: locationTypeIds };
    }

    if (isOpenToWork) {
      where.isOpenToWork = true;
    }
  }

  private mapToProfessionalDtos(
    professionals: LoadedProfessional[],
  ): ProfessionalListItemDto[] {
    return professionals.map(
      (professional) =>
        new ProfessionalListItemDto({
          handle: professional.member.handle,
          fullName: professional.member.fullName,
          title: professional.member.title,
          bio: professional.member.bio,
          avatarUrl: professional.member.avatarUrl,
          location: {
            country: professional.member.country.name,
            city: professional.member.city.name,
          },
          isOpenToWork: professional.isOpenToWork,
          requiresVisaSponsorship: professional.requiresVisaSponsorship,
          skills: professional.skills,
        }),
    );
  }
}
