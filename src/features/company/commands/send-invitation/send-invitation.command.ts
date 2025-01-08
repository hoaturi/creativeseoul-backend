import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { SendInvitationRequestDto } from '../../dtos/requests/send-invitation-request.dto';

export class SendInvitationCommand extends Command<Result<void, ResultError>> {
  public constructor(public readonly dto: SendInvitationRequestDto) {
    super();
  }
}
