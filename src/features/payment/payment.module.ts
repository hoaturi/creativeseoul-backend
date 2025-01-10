import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { ProcessWebhookHandler } from './commands/process-webhook/process-webhook.handler';
import { StripeModule } from '../../infrastructure/services/stripe/stripe.module';
import { CreateCheckoutHandler } from './commands/create-checkout/create-checkout.handler';

@Module({
  imports: [StripeModule],
  providers: [ProcessWebhookHandler, CreateCheckoutHandler],
  controllers: [PaymentController],
})
export class PaymentModule {}
