import { Inject, Injectable } from '@nestjs/common';
import { applicationConfig } from '../../../config/application.config';
import { ConfigType } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  public constructor(
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {
    this.stripe = new Stripe(appConfig.stripe.secretKey);
  }

  public verifyWebhook(rawBody: Buffer<ArrayBufferLike>, signature: string) {
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

  public async createCheckout(
    priceId: string,
    customerId: string,
    companyId: string,
    metadata: Record<string, any>,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    return await this.stripe.checkout.sessions.create({
      client_reference_id: companyId,
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: this.appConfig.client.baseUrl,
      mode: 'payment',
      metadata,
    });
  }
}
