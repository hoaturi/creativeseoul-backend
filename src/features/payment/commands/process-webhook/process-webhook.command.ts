import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Stripe } from 'stripe';

export class ProcessWebhookCommand extends Command<Result<void, ResultError>> {
  public constructor(public readonly event: Stripe.Event) {
    super();
  }
}
