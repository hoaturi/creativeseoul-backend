import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { ProcessWebhookHandler } from './commands/process-webhook/process-webhook.handler';
import { StripeModule } from '../../infrastructure/services/stripe/stripe.module';
import { CreateCreditCheckoutHandler } from './commands/create-credit-checkout/create-credit-checkout.handler';
import { CreateSponsorshipCheckoutHandler } from './commands/create-sponsorship-checkout/create-sponsorship-checkout.handler';

@Module({
  imports: [StripeModule],
  providers: [
    ProcessWebhookHandler,
    CreateCreditCheckoutHandler,
    CreateSponsorshipCheckoutHandler,
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
