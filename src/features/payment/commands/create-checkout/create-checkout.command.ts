import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { CreateCheckoutRequestDto } from '../../dtos/create-checkout-request.dto';
import { CreateCheckoutResponseDto } from '../../dtos/create-checkout-response.dto';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class CreateCheckoutCommand extends Command<
  Result<CreateCheckoutResponseDto, ResultError>
> {
  public constructor(
    public readonly user: AuthenticatedUser,
    public readonly dto: CreateCheckoutRequestDto,
  ) {
    super();
  }
}
