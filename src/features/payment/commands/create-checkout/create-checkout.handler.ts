import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCheckoutCommand } from './create-checkout.command';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { CreateCheckoutResponseDto } from '../../dtos/create-checkout-response.dto';
import { StripeService } from '../../../../infrastructure/services/stripe/stripe.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Company } from '../../../../domain/company/company.entity';
import { CompanyNotFoundException } from '../../../../domain/company/company-not-found.exception';

@CommandHandler(CreateCheckoutCommand)
export class CreateCheckoutHandler
  implements ICommandHandler<CreateCheckoutCommand>
{
  public constructor(
    private readonly em: EntityManager,
    private readonly stripeService: StripeService,
  ) {}

  public async execute(
    command: CreateCheckoutCommand,
  ): Promise<Result<CreateCheckoutResponseDto, ResultError>> {
    const { user, dto } = command;

    const company = await this.em.findOne(
      Company,
      { id: user.profileId },
      {
        fields: ['id', 'customerId'],
      },
    );

    if (!company) {
      throw new CompanyNotFoundException(user.profileId);
    }

    const checkout = await this.stripeService.createCheckout(
      dto.priceId,
      company.customerId,
      company.id,
    );

    return Result.success(new CreateCheckoutResponseDto(checkout.url));
  }
}
