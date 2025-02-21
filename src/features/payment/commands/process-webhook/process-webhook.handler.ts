import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProcessWebhookCommand } from './process-webhook.command';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { EntityManager } from '@mikro-orm/postgresql';
import { Company } from '../../../../domain/company/entities/company.entity';
import {
  CreditTransaction,
  CreditTransactionType,
} from '../../../../domain/company/entities/credit-transaction.entity';
import { ProductType } from '../../../../domain/payment/product-type.enum';
import { CompanyNotFoundByCustomerIdException } from '../../../../domain/company/exceptions/company-not-found-by-customer-id.exception';
import {
  Sponsorship,
  SponsorshipStatus,
} from '../../../../domain/company/entities/sponsorship.entity';
import { Stripe } from 'stripe';

@CommandHandler(ProcessWebhookCommand)
export class ProcessWebhookHandler
  implements ICommandHandler<ProcessWebhookCommand>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: ProcessWebhookCommand,
  ): Promise<Result<void, ResultError>> {
    const { event } = command;

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object);
        break;

      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
    }

    return Result.success();
  }

  private async handleCheckoutCompleted(
    checkoutSession: Stripe.Checkout.Session,
  ): Promise<void> {
    const { type, creditAmount } = checkoutSession.metadata as {
      type: ProductType;
      creditAmount: string;
    };

    if (type !== ProductType.CREDIT || !creditAmount) {
      return;
    }

    const isAlreadyProcessed = await this.em.findOne(CreditTransaction, {
      checkoutId: checkoutSession.id,
    });

    if (isAlreadyProcessed) {
      return;
    }

    const company = await this.findCompanyByCustomerId(
      checkoutSession.customer as string,
      ['id', 'creditBalance', 'creditTransactions'],
    );

    const parsedCreditAmount = parseInt(creditAmount);
    company.creditBalance += parsedCreditAmount;

    const randomStr = Math.random().toString(36).substring(2, 8);
    const transaction = this.em.create(
      CreditTransaction,
      new CreditTransaction({
        displayId: randomStr,
        company: company as Company,
        amount: parsedCreditAmount,
        type: CreditTransactionType.PURCHASE,
        checkoutId: checkoutSession.id,
      }),
    );

    company.creditTransactions.add(transaction);
    await this.em.flush();
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    const sponsorship = await this.em.findOne(Sponsorship, {
      subscriptionId: invoice.subscription as string,
    });

    if (!sponsorship) {
      await this.createNewSponsorship(invoice);
    } else {
      await this.renewExistingSponsorship(sponsorship, invoice);
    }
  }

  private async createNewSponsorship(invoice: Stripe.Invoice): Promise<void> {
    const company = await this.findCompanyByCustomerId(
      invoice.customer as string,
      ['id'],
    );

    const { start, end } = invoice.lines.data[0].period;

    this.em.create(
      Sponsorship,
      new Sponsorship({
        company: company as unknown as Company,
        subscriptionId: invoice.subscription as string,
        status: SponsorshipStatus.ACTIVE,
        currentPeriodStart: new Date(start * 1000),
        currentPeriodEnd: new Date(end * 1000),
      }),
    );

    await this.em.flush();
  }

  private async renewExistingSponsorship(
    sponsorship: Sponsorship,
    invoice: Stripe.Invoice,
  ): Promise<void> {
    sponsorship.currentPeriodStart = new Date(invoice.period_start * 1000);
    sponsorship.currentPeriodEnd = new Date(invoice.period_end * 1000);
    await this.em.flush();
  }

  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const sponsorship = await this.em.findOne(Sponsorship, {
      subscriptionId: subscription.id,
    });

    if (sponsorship) {
      sponsorship.status = SponsorshipStatus.CANCELLED;
      await this.em.flush();
    }
  }

  private async findCompanyByCustomerId(
    customerId: string,
    fields: any[],
  ): Promise<Company> {
    const company = await this.em.findOne(Company, { customerId }, { fields });

    if (!company) {
      throw new CompanyNotFoundByCustomerIdException(customerId);
    }

    return company;
  }
}
