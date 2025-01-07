import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { CreateCompanyRequestDto } from '../../dtos/create-company-request.dto';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class CreateCompanyCommand extends Command<Result<void, ResultError>> {
  public constructor(
    public readonly user: AuthenticatedUser,
    public readonly dto: CreateCompanyRequestDto,
  ) {
    super();
  }
}
