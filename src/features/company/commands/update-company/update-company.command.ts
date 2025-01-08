import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { UpdateCompanyRequestDto } from '../../dtos/update-company-request.dto';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class UpdateCompanyCommand extends Command<Result<void, ResultError>> {
  public constructor(
    public readonly user: AuthenticatedUser,
    public readonly dto: UpdateCompanyRequestDto,
  ) {
    super();
  }
}
