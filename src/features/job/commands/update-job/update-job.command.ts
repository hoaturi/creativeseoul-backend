import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';
import { UpdateJobRequestDto } from '../../dtos/requests/update-job-request.dto';

export class UpdateJobCommand extends Command<Result<void, ResultError>> {
  public constructor(
    public readonly user: AuthenticatedUser,
    public readonly slug: string,
    public readonly dto: UpdateJobRequestDto,
  ) {
    super();
  }
}
