import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { ProcessWebhookHandler } from './commands/process-webhook/process-webhook.handler';
import { StripeModule } from '../../infrastructure/services/stripe/stripe.module';
import { CreateCreditCheckoutHandler } from './commands/create-credit-checkout/create-credit-checkout.handler';

@Module({
  imports: [StripeModule],
  providers: [ProcessWebhookHandler, CreateCreditCheckoutHandler],
  controllers: [PaymentController],
})
export class PaymentModule {}
