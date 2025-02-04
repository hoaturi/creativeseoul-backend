import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';
import { CreateTalentRequestDto } from '../../dtos/requests/create-talent-request.dto';
import { SessionResponseDto } from '../../../auth/dtos/session-response.dto';

export class CreateTalentCommand extends Command<
  Result<SessionResponseDto, ResultError>
> {
  public constructor(
    public readonly user: AuthenticatedUser,
    public readonly dto: CreateTalentRequestDto,
  ) {
    super();
  }
}
