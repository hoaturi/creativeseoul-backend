import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { AcceptInvitationRequestDto } from '../../dtos/requests/accept-invitation-request.dto';

export class AcceptInvitationCommand extends Command<
  Result<void, ResultError>
> {
  public constructor(public readonly dto: AcceptInvitationRequestDto) {
    super();
  }
}
