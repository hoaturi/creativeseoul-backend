import { Inject, Injectable } from '@nestjs/common';
import { applicationConfig } from '../../../config/application.config';
import { ConfigType } from '@nestjs/config';
import {
  createCheckout,
  createCustomer,
  lemonSqueezySetup,
} from '@lemonsqueezy/lemonsqueezy.js';

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

  public async createCustomer(email: string, name: string): Promise<string> {
    const customer = await createCustomer(this.storeId, {
      email,
      name,
    });

    return customer.data.data.id;
  }

  public async createCheckout(
    variantId: number,
    email: string,
    name: string,
    companyId: string,
  ): Promise<string> {
    const checkout = await createCheckout(this.storeId, variantId, {
      checkoutData: {
        email,
        name,
        custom: {
          companyId: companyId,
        },
      },
    });

    return checkout.data.data.attributes.url;
  }
}
