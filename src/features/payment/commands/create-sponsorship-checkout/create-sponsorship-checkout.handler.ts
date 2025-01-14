import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSponsorshipCheckoutCommand } from './create-sponsorship-checkout.command';
import { StripeService } from '../../../../infrastructure/services/stripe/stripe.service';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { CreateCheckoutResponseDto } from '../../dtos/create-checkout-response.dto';
import { Company } from '../../../../domain/company/company.entity';
import { CompanyNotFoundException } from '../../../../domain/company/company-not-found.exception';
import { EntityManager } from '@mikro-orm/postgresql';
import { applicationConfig } from '../../../../config/application.config';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

@CommandHandler(CreateSponsorshipCheckoutCommand)
export class CreateSponsorshipCheckoutHandler
  implements ICommandHandler<CreateSponsorshipCheckoutCommand>
{
  public constructor(
    private readonly em: EntityManager,
    private readonly stripeService: StripeService,
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {}

  public async execute(
    command: CreateSponsorshipCheckoutCommand,
  ): Promise<Result<CreateCheckoutResponseDto, ResultError>> {
    const { user } = command;

    const company = await this.em.findOne(
      Company,
      { id: user.profileId },
      {
        fields: ['customerId'],
      },
    );

    if (!company) {
      throw new CompanyNotFoundException(user.profileId!);
    }

    const checkout = await this.stripeService.createSponsorshipCheckout(
      this.appConfig.stripe.sponsorshipPriceId,
      company.customerId!,
    );

    return Result.success(new CreateCheckoutResponseDto(checkout.url!));
  }
}
