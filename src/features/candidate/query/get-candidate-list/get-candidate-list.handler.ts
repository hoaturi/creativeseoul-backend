import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCandidateListQuery } from './get-candidate-list.query';
import { Result } from '../../../../common/result/result';
import {
  CandidateListItemDto,
  GetCandidateListResponseDto,
} from '../../dtos/get-candidate-list-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import { Candidate } from '../../../../domain/candidate/candidate.entity';

@QueryHandler(GetCandidateListQuery)
export class GetCandidateListHandler
  implements IQueryHandler<GetCandidateListQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetCandidateListQuery,
  ): Promise<Result<GetCandidateListResponseDto, ResultError>> {
    const page = query.page || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const conditions: FilterQuery<Candidate> = {
      isAvailable: true,
    };

    if (query.search) {
      conditions.searchVector = { $fulltext: query.search };
    }

    if (query.categories?.length) {
      conditions.preferredCategories = { $in: query.categories };
    }

    if (query.employmentTypes?.length) {
      conditions.preferredEmploymentTypes = { $in: query.employmentTypes };
    }

    if (query.workLocationTypes?.length) {
      conditions.preferredWorkLocations = { $in: query.workLocationTypes };
    }

    if (query.states?.length) {
      conditions.preferredStates = { $in: query.states };
    }

    if (query.languages?.length) {
      conditions.languages = { language: { $in: query.languages } };
    }

    const [candidates, total] = await this.em.findAndCount(
      Candidate,
      conditions,
      {
        populate: [
          'preferredCategories',
          'preferredWorkLocations',
          'preferredStates',
          'preferredEmploymentTypes',
          'languages',
        ],
        fields: ['id', 'title', 'bio', 'profilePictureUrl'],
        limit,
        offset,
      },
    );

    const mappedCandidates = this.mapCandidateToDto(candidates);

    return Result.success(
      new GetCandidateListResponseDto(mappedCandidates, total),
    );
  }

  private mapCandidateToDto(
    candidate: Partial<Candidate>[],
  ): CandidateListItemDto[] {
    return candidate.map((c) => {
      return new CandidateListItemDto(
        c.id,
        c.title,
        c.bio,
        c.profilePictureUrl,
        c.preferredCategories.getIdentifiers(),
        c.preferredWorkLocations.getIdentifiers(),
        c.preferredStates.getIdentifiers(),
        c.preferredEmploymentTypes.getIdentifiers(),
        c.languages.map((l) => l.language.id),
      );
    });
  }
}
