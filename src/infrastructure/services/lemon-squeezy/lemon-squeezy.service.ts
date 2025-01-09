import { Inject, Injectable } from '@nestjs/common';
import { applicationConfig } from '../../../config/application.config';
import { ConfigType } from '@nestjs/config';
import {
  type Checkout,
  createCheckout,
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

  public async getCustomer(customerId: string): Promise<Customer> {
    const customer = await getCustomer(customerId);

    if (!customer.data.data) {
      throw new PaymentCustomerNotFoundException(customerId);
    }

    return customer.data;
  }

  public async createCheckout(
    variantId: number,
    companyId: string,
  ): Promise<Checkout> {
    const checkout = await createCheckout(this.storeId, variantId, {
      checkoutData: {
        custom: {
          companyId: companyId,
        },
      },
    });

    return checkout.data;
  }
}
