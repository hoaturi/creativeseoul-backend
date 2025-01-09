import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { ProcessWebhookHandler } from './commands/process-webhook/process-webhook.handler';
import { LemonSqueezyModule } from '../../infrastructure/services/lemon-squeezy/lemon-squeezy.module';
import { CreateCheckoutHandler } from './commands/create-checkout/create-checkout.handler';

@Module({
  imports: [LemonSqueezyModule],
  providers: [ProcessWebhookHandler, CreateCheckoutHandler],
  controllers: [PaymentController],
})
export class PaymentModule {}
