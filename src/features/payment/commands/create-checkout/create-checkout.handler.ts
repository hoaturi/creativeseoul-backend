import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCheckoutCommand } from './create-checkout.command';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { CreateCheckoutResponseDto } from '../../dtos/create-checkout-response.dto';
import { LemonSqueezyService } from '../../../../infrastructure/services/lemon-squeezy/lemon-squeezy.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Company } from '../../../../domain/company/company.entity';
import { CompanyNotFoundException } from '../../../../domain/company/company-not-found.exception';

@CommandHandler(CreateCheckoutCommand)
export class CreateCheckoutHandler
  implements ICommandHandler<CreateCheckoutCommand>
{
  public constructor(
    private readonly em: EntityManager,
    private readonly lemonSqueezyService: LemonSqueezyService,
  ) {}

  public async execute(
    command: CreateCheckoutCommand,
  ): Promise<Result<CreateCheckoutResponseDto, ResultError>> {
    const { user, dto } = command;

    const company = await this.em.findOne(
      Company,
      { id: user.profileId },
      {
        fields: ['paymentCustomerId'],
      },
    );

    if (!company) {
      throw new CompanyNotFoundException(user.profileId);
    }

    const customer = await this.lemonSqueezyService.getCustomer(
      company.paymentCustomerId,
    );

    const checkout = await this.lemonSqueezyService.createCheckout(
      dto.variantId,
      customer.data.attributes.email,
      customer.data.attributes.name,
      company.paymentCustomerId,
    );

    return Result.success(
      new CreateCheckoutResponseDto(checkout.data.attributes.url),
    );
  }
}
