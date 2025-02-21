import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetCreditTransactionListResponseDto } from '../../dtos/responses/get-credit-transaction-list-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class GetCreditTransactionListQuery extends Query<
  Result<GetCreditTransactionListResponseDto, ResultError>
> {
  public constructor(public readonly user: AuthenticatedUser) {
    super();
  }
}
