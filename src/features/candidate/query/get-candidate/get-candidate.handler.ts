import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCandidateQuery } from './get-candidate.query';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  CandidateLanguageListItemDto,
  GetCandidateResponseDto,
} from '../../dtos/get-candidate-response.dto';
import { Candidate } from '../../../../domain/candidate/candidate.entity';
import { CandidateError } from '../../candidate.error';
import { Logger } from '@nestjs/common';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';

@QueryHandler(GetCandidateQuery)
export class GetCandidateHandler implements IQueryHandler<GetCandidateQuery> {
  private readonly logger = new Logger(GetCandidateHandler.name);

  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetCandidateQuery,
  ): Promise<Result<GetCandidateResponseDto, ResultError>> {
    const candidate = await this.em.findOne(
      Candidate,
      {
        id: query.candidateId,
      },
      {
        populate: [
          'preferredCategories',
          'preferredEmploymentTypes',
          'preferredWorkLocationTypes',
          'preferredStates',
          'languages',
        ],
      },
    );

    if (!candidate) {
      return Result.failure(CandidateError.ProfileNotFound);
    }

    if (!candidate.isAvailable && query.userId !== candidate.user.id) {
      this.logger.warn(
        { userId: query.userId, candidateId: candidate.id },
        'candidate.get-candidate.failed: Candidate profile not available',
      );

      return Result.failure(CandidateError.ProfileNotAvailable);
    }

    return Result.success(this.mapCandidateToDto(candidate));
  }

  private mapCandidateToDto(candidate: Candidate): GetCandidateResponseDto {
    return new GetCandidateResponseDto(
      candidate.id,
      candidate.fullName,
      candidate.title,
      candidate.bio,
      candidate.profilePictureUrl,
      candidate.resumeUrl,
      candidate.preferredCategories.getIdentifiers(),
      candidate.preferredWorkLocationTypes.getIdentifiers(),
      candidate.preferredStates.getIdentifiers(),
      candidate.preferredEmploymentTypes.getIdentifiers(),
      candidate.languages.getItems().map((language) => {
        return new CandidateLanguageListItemDto(
          language.language.id,
          language.proficiencyLevel,
        );
      }),
    );
  }
}
