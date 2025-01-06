import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { GetTalentListQueryDto } from '../../dtos/requests/get-talent-list-query.dto';

export class GetTalentListQuery extends Query<Result<any, ResultError>> {
  public constructor(public readonly dto: GetTalentListQueryDto) {
    super();
  }
}
