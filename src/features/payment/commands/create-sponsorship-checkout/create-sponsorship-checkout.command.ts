import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { CreateCheckoutResponseDto } from '../../dtos/create-checkout-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class CreateSponsorshipCheckoutCommand extends Command<
  Result<CreateCheckoutResponseDto, ResultError>
> {
  public constructor(public readonly user: AuthenticatedUser) {
    super();
  }
}
