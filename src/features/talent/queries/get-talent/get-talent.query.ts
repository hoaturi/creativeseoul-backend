import { Query } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetTalentResponseDto } from '../../dtos/responses/get-talent-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class GetTalentQuery extends Query<
  Result<GetTalentResponseDto, ResultError>
> {
  public constructor(
    public readonly handle: string,
    public readonly user?: AuthenticatedUser,
  ) {
    super();
  }
}
