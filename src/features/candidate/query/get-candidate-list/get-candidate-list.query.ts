import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetCandidateListResponseDto } from '../../dtos/get-candidate-list-response.dto';
import { ResultError } from '../../../../common/result/result-error';

export class GetCandidateListQuery extends Query<
  Result<GetCandidateListResponseDto, ResultError>
> {
  public constructor(
    public readonly page?: number,
    public readonly search?: string,
    public readonly categories?: number[],
    public readonly employmentTypes?: number[],
    public readonly workLocationTypes?: number[],
    public readonly states?: number[],
    public readonly languages?: number[],
  ) {
    super();
  }
}
