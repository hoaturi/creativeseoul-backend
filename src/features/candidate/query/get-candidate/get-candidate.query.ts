import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetCandidateResponseDto } from '../../dtos/get-candidate-response.dto';
import { ResultError } from '../../../../common/result/result-error';

export class GetCandidateQuery extends Query<
  Result<GetCandidateResponseDto, ResultError>
> {
  public constructor(
    public readonly candidateId: string,
    public readonly userId?: string,
  ) {
    super();
  }
}
