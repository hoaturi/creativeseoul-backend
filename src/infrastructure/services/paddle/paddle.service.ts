import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  Customer,
  Environment,
  EventEntity,
  Paddle,
} from '@paddle/paddle-node-sdk';
import { applicationConfig } from '../../../config/application.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class PaddleService {
  private readonly paddle: Paddle;
  private readonly logger = new Logger(PaddleService.name);

  public constructor(
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {
    this.paddle = new Paddle(appConfig.paddle.apiKey, {
      environment: Environment.sandbox,
    });
  }

  public async getEventData(
    signature: string,
    reqBody: string,
  ): Promise<EventEntity> {
    return await this.paddle.webhooks.unmarshal(
      reqBody,
      this.appConfig.paddle.webhookSecretKey,
      signature,
    );
  }

  public async createCustomer(
    name: string,
    email: string,
    companyId: string,
  ): Promise<Customer> {
    const customer = await this.paddle.customers.create({
      email,
      customData: { companyId },
    });

    await this.paddle.businesses.create(customer.id, {
      name,
      contacts: [{ email }],
      customData: { companyId },
    });

    this.logger.log(
      { companyId, customerId: customer.id },
      'payment.customer.created: Customer created successfully',
    );

    return customer;
  }
}
