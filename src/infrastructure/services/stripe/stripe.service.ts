import { Inject, Injectable } from '@nestjs/common';
import { applicationConfig } from '../../../config/application.config';
import { ConfigType } from '@nestjs/config';
import Stripe from 'stripe';
import { ProductType } from '../../../domain/payment/product-type.enum';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  public constructor(
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {
    this.stripe = new Stripe(appConfig.stripe.secretKey);
  }

  public verifyWebhook(
    rawBody: Buffer<ArrayBufferLike>,
    signature: string,
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      this.appConfig.stripe.webhookSecret,
    );
  }

  public async createCustomer(
    name: string,
    email: string,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    return await this.stripe.customers.create({
      name,
      email,
    });
  }

  public async createCreditCheckout(
    priceId: string,
    customerId: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const creditAmount =
      priceId === this.appConfig.stripe.singleJobPriceId ? 1 : 3;

    const metadata = {
      type: ProductType.CREDIT,
      creditAmount: creditAmount,
    };

    return await this.stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: this.appConfig.client.baseUrl,
      mode: 'payment',
      metadata,
    });
  }

  public async createSponsorshipCheckout(
    priceId: string,
    customerId: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    return await this.stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: this.appConfig.client.baseUrl,
      mode: 'subscription',
      metadata: {
        type: ProductType.SPONSORSHIP,
      },
    });
  }

  public async getCustomerPortal(
    customerId: string,
  ): Promise<Stripe.Response<Stripe.BillingPortal.Session>> {
    return await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${this.appConfig.client.baseUrl}/me/billing`,
    });
  }
}
