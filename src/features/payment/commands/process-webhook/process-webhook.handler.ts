import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProcessWebhookCommand } from './process-webhook.command';
import { StripeService } from '../../../../infrastructure/services/stripe/stripe.service';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { EntityManager } from '@mikro-orm/postgresql';
import { Company } from '../../../../domain/company/company.entity';
import {
  CreditTransaction,
  CreditTransactionType,
} from '../../../../domain/company/credit-transaction.entity';
import { ProductType } from '../../../../domain/payment/product-type.enum';
import { CompanyNotFoundByCustomerIdException } from '../../../../domain/company/company-not-found-by-customer-id.exception';

@CommandHandler(ProcessWebhookCommand)
export class ProcessWebhookHandler
  implements ICommandHandler<ProcessWebhookCommand>
{
  public constructor(
    private readonly stripeService: StripeService,
    private readonly em: EntityManager,
  ) {}

  public async execute(
    command: ProcessWebhookCommand,
  ): Promise<Result<void, ResultError>> {
    const { event } = command;

    if (event.type === 'checkout.session.completed') {
      const type = event.data.object.metadata.type;
      const creditAmount = event.data.object.metadata.creditAmount;

      if (type === ProductType.CREDIT && creditAmount) {
        const customerId = event.data.object.customer as string;

        const company = await this.em.findOne(
          Company,
          { customerId: customerId },
          {
            fields: ['id', 'creditBalance', 'creditTransactions'],
          },
        );

        if (!company) {
          throw new CompanyNotFoundByCustomerIdException(customerId);
        }

        company.creditBalance += parseInt(creditAmount);

        const transaction = this.em.create(CreditTransaction, {
          company: company as unknown as Company,
          amount: parseInt(creditAmount),
          type: CreditTransactionType.PURCHASE,
          checkoutId: event.data.object.id,
        });

        company.creditTransactions.add(transaction);

        await this.em.flush();
      }
    }
    return Result.success();
  }
}
