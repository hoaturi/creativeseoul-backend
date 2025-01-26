import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCreditCheckoutCommand } from './create-credit-checkout.command';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { CreateCheckoutResponseDto } from '../../dtos/create-checkout-response.dto';
import { StripeService } from '../../../../infrastructure/services/stripe/stripe.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Company } from '../../../../domain/company/entities/company.entity';
import { CompanyNotFoundException } from '../../../../domain/company/exceptions/company-not-found.exception';

@CommandHandler(CreateCreditCheckoutCommand)
export class CreateCreditCheckoutHandler
  implements ICommandHandler<CreateCreditCheckoutCommand>
{
  public constructor(
    private readonly em: EntityManager,
    private readonly stripeService: StripeService,
  ) {}

  public async execute(
    command: CreateCreditCheckoutCommand,
  ): Promise<Result<CreateCheckoutResponseDto, ResultError>> {
    const { user, dto } = command;

    const company = await this.em.findOne(
      Company,
      { id: user.profile.id },
      {
        fields: ['id', 'customerId'],
      },
    );

    if (!company) {
      throw new CompanyNotFoundException(user.profile.id!);
    }

    const checkout = await this.stripeService.createCreditCheckout(
      dto.priceId,
      company.customerId!,
    );

    return Result.success(new CreateCheckoutResponseDto(checkout.url!));
  }
}
