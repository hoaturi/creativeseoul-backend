import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCandidateQuery } from './get-candidate.query';
import { EntityManager } from '@mikro-orm/postgresql';
import { GetCandidateResponseDto } from '../../dtos/get-candidate-response.dto';
import { Candidate } from '../../../../domain/candidate/candidate.entity';
import { CandidateError } from '../../candidate.error';
import { Logger } from '@nestjs/common';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { ReferenceDataDto } from '../../../common/dtos/reference-data.dto';
import { LanguageWithLevelDto } from '../../../common/dtos/language-with-level.dto';

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
          'languages.language',
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

  private mapToReferenceDataDto(entity: {
    id: number;
    name: string;
    slug: string;
  }): ReferenceDataDto {
    return new ReferenceDataDto(entity.id, entity.name, entity.slug);
  }

  private mapCandidateToDto(candidate: Candidate): GetCandidateResponseDto {
    return new GetCandidateResponseDto(
      candidate.id,
      candidate.fullName,
      candidate.title,
      candidate.bio,
      candidate.profilePictureUrl,
      candidate.resumeUrl,
      candidate.preferredCategories.getItems().map(this.mapToReferenceDataDto),
      candidate.preferredWorkLocationTypes
        .getItems()
        .map(this.mapToReferenceDataDto),
      candidate.preferredStates.getItems().map(this.mapToReferenceDataDto),
      candidate.preferredEmploymentTypes
        .getItems()
        .map(this.mapToReferenceDataDto),
      candidate.languages
        .getItems()
        .map(
          (lang) =>
            new LanguageWithLevelDto(
              lang.language.id,
              lang.language.name,
              lang.language.slug,
              lang.level,
            ),
        ),
    );
  }
}
