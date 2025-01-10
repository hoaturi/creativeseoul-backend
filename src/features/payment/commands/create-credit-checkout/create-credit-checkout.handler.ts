import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCreditCheckoutCommand } from './create-credit-checkout.command';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { CreateCheckoutResponseDto } from '../../dtos/create-checkout-response.dto';
import { StripeService } from '../../../../infrastructure/services/stripe/stripe.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Company } from '../../../../domain/company/company.entity';
import { CompanyNotFoundException } from '../../../../domain/company/company-not-found.exception';
import { ProductType } from '../../../../domain/payment/product-type.enum';
import { Inject } from '@nestjs/common';
import { applicationConfig } from '../../../../config/application.config';
import { ConfigType } from '@nestjs/config';

@CommandHandler(CreateCreditCheckoutCommand)
export class CreateCreditCheckoutHandler
  implements ICommandHandler<CreateCreditCheckoutCommand>
{
  public constructor(
    private readonly em: EntityManager,
    private readonly stripeService: StripeService,
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {}

  public async execute(
    command: CreateCreditCheckoutCommand,
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

    const creditAmount =
      dto.priceId === this.appConfig.stripe.singleJobPriceId ? 1 : 3;

    const checkout = await this.stripeService.createCheckout(
      dto.priceId,
      company.customerId,
      company.id,
      {
        type: ProductType.CREDIT,
        creditAmount: creditAmount,
      },
    );

    return Result.success(new CreateCheckoutResponseDto(checkout.url));
  }
}
