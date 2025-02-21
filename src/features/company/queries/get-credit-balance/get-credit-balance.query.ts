import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';
import { GetCreditBalanceResponseDto } from '../../dtos/responses/get-credit-balance-response.dto';

export class GetCreditBalanceQuery extends Query<
  Result<GetCreditBalanceResponseDto, ResultError>
> {
  public constructor(public readonly user: AuthenticatedUser) {
    super();
  }
}
