import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { GetProfessionalListQueryDto } from '../../dtos/requests/get-professional-list-query.dto';

export class GetProfessionalListQuery extends Query<Result<any, ResultError>> {
  public constructor(public readonly dto: GetProfessionalListQueryDto) {
    super();
  }
}
