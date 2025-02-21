import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';
import { GetCustomerPortalResponseDto } from '../../dtos/responses/get-customer-portal-response.dto';

export class GetCustomerPortalQuery extends Query<
  Result<GetCustomerPortalResponseDto, ResultError>
> {
  public constructor(public readonly user: AuthenticatedUser) {
    super();
  }
}
