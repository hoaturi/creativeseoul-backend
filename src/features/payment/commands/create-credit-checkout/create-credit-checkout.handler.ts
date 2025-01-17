import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCreditCheckoutCommand } from './create-credit-checkout.command';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { CreateCheckoutResponseDto } from '../../dtos/create-checkout-response.dto';
import { StripeService } from '../../../../infrastructure/services/stripe/stripe.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Company } from '../../../../domain/company/entities/company.entity';
import { CompanyNotFoundException } from '../../../../domain/company/exceptions/company-not-found.exception';
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
      throw new CompanyNotFoundException(user.profileId!);
    }

    const checkout = await this.stripeService.createCreditCheckout(
      dto.priceId,
      company.customerId!,
    );

    return Result.success(new CreateCheckoutResponseDto(checkout.url!));
  }
}
