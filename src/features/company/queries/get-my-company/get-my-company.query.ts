import { Result } from '../../../../common/result/result';
import { GetMyCompanyResponseDto } from '../../dtos/responses/get-my-company-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { Query } from '@nestjs/cqrs';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class GetMyCompanyQuery extends Query<
  Result<GetMyCompanyResponseDto, ResultError>
> {
  public constructor(public readonly user: AuthenticatedUser) {
    super();
  }
}
