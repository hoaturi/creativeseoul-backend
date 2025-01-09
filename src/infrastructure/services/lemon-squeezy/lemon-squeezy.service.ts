import { Inject, Injectable } from '@nestjs/common';
import { applicationConfig } from '../../../config/application.config';
import { ConfigType } from '@nestjs/config';
import {
  type Checkout,
  createCheckout,
  createCustomer,
  type Customer,
  getCustomer,
  lemonSqueezySetup,
} from '@lemonsqueezy/lemonsqueezy.js';
import { PaymentCustomerNotFoundException } from '../../../domain/payment/payment-customer-not-found.exception';

@Injectable()
export class LemonSqueezyService {
  private readonly storeId: string;

  public constructor(
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {
    lemonSqueezySetup({
      apiKey: appConfig.lemonSqueezy.apiKey,
    });
    this.storeId = appConfig.lemonSqueezy.storeId;
  }
  //TODO: Needs error handling as they are not throwing any errors
  public async createCustomer(email: string, name: string): Promise<string> {
    const customer = await createCustomer(this.storeId, {
      email,
      name,
    });

    return customer.data.data.id;
  }

  public async getCustomer(customerId: string): Promise<Customer> {
    const customer = await getCustomer(customerId);

    if (!customer.data.data) {
      throw new PaymentCustomerNotFoundException(customerId);
    }

    return customer.data;
  }

  public async createCheckout(
    variantId: number,
    email: string,
    name: string,
    companyId: string,
  ): Promise<Checkout> {
    const checkout = await createCheckout(this.storeId, variantId, {
      checkoutData: {
        email,
        name,
        custom: {
          companyId: companyId,
        },
      },
    });

    return checkout.data;
  }
}
