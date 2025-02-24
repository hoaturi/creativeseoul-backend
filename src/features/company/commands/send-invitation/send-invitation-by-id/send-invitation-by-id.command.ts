import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../../common/result/result';
import { ResultError } from '../../../../../common/result/result-error';
import { SendInvitationByIdRequestDto } from '../../../dtos/requests/send-invitation-by-id-request.dto';

export class SendInvitationByIdCommand extends Command<
  Result<void, ResultError>
> {
  public constructor(
    public readonly id: string,
    public readonly dto: SendInvitationByIdRequestDto,
  ) {
    super();
  }
}
