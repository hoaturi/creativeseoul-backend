import { Query } from '@nestjs/cqrs';
import { Result } from '../../../common/result/result';
import { GetProfessionalResponseDto } from '../dtos/get-professional-response.dto';
import { ResultError } from '../../../common/result/result-error';
import { AuthenticatedUser } from '../../../infrastructure/security/authenticated-user.interface';

export class GetProfessionalQuery extends Query<
  Result<GetProfessionalResponseDto, ResultError>
> {
  public constructor(
    public readonly user: AuthenticatedUser,
    public readonly handle: string,
  ) {
    super();
  }
}
