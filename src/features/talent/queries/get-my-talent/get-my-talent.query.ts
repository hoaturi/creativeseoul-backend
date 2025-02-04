import { Result } from '../../../../common/result/result';
import { Query } from '@nestjs/cqrs';
import { ResultError } from '../../../../common/result/result-error';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';
import { GetMyTalentResponseDto } from '../../dtos/responses/get-my-talent-response.dto';

export class GetMyTalentQuery extends Query<
  Result<GetMyTalentResponseDto, ResultError>
> {
  public constructor(public readonly user: AuthenticatedUser) {
    super();
  }
}
