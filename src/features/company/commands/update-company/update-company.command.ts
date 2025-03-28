import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { UpdateCompanyRequestDto } from '../../dtos/requests/update-company-request.dto';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';
import { SessionResponseDto } from '../../../auth/dtos/session-response.dto';

export class UpdateCompanyCommand extends Command<
  Result<SessionResponseDto, ResultError>
> {
  public constructor(
    public readonly user: AuthenticatedUser,
    public readonly dto: UpdateCompanyRequestDto,
  ) {
    super();
  }
}
