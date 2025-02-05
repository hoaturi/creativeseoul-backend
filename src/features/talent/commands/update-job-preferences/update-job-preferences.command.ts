import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';
import { UpdateJobPreferencesRequestDto } from '../../dtos/requests/update-job-preferences-request.dto';

export class UpdateJobPreferencesCommand extends Command<
  Result<void, ResultError>
> {
  public constructor(
    public readonly user: AuthenticatedUser,
    public readonly dto: UpdateJobPreferencesRequestDto,
  ) {
    super();
  }
}
