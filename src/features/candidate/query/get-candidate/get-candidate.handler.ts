import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCandidateQuery } from './get-candidate.query';
import { EntityManager } from '@mikro-orm/postgresql';
import { GetCandidateResponseDto } from '../../dtos/get-candidate-response.dto';
import { Logger } from '@nestjs/common';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Candidate } from '../../../../domain/candidate/candidate.entity';
import { CandidateError } from '../../candidate.error';

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
        populate: ['member', 'member.user', 'jobCategories'],
      },
    );

    if (!candidate) {
      return Result.failure(CandidateError.NotFound);
    }

    if (!candidate.isOpenToWork && query.userId !== candidate.member.user.id) {
      this.logger.warn(
        { userId: query.userId, candidateId: candidate.id },
        'candidate.get-candidate.failed: Candidate not available',
      );

      return Result.failure(CandidateError.NotAvailable);
    }
  }
}
