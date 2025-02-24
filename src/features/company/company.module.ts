import { Module, Provider } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { UpdateCompanyHandler } from './commands/update-company/update-company.handler';
import { GetCompanyListHandler } from './queries/get-company-list/get-company-list.handler';
import { SendInvitationHandler } from './commands/send-invitation/send-invitation.handler';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from '../../infrastructure/queues/queue-type.enum';
import { AcceptInvitationHandler } from './commands/accept-invitation/accept-invitation.handler';
import { StripeModule } from '../../infrastructure/services/stripe/stripe.module';
import { GetCompanyHandler } from './queries/get-company/get-company.handler';
import { GetMyLogoUploadUrlHandler } from './commands/get-my-logo-upload-url/get-my-logo-upload-url.handler';
import { StorageModule } from '../../infrastructure/services/storage/storage.module';
import { GetLogoUploadUrlHandler } from './commands/get-logo-upload-url/get-logo-upload-url.handler';
import { GetSponsorCompanyListHandler } from './queries/get-sponsor-company-list/get-sponsor-company-list.handler';
import { GetMyCompanyHandler } from './queries/get-my-company/get-my-company.handler';
import { GetCustomerPortalHandler } from './queries/get-customer-portal/get-customer-portal.handler';
import { GetCreditBalanceHandler } from './queries/get-credit-balance/get-credit-balance.handler';
import { GetCreditTransactionListHandler } from './queries/get-credit-transaction-list/get-credit-transaction-list.handler';
import { GetUnclaimedCompanyListHandler } from './queries/get-unclaimed-company-list/get-unclaimed-company-list.handler';
import { SendInvitationByIdHandler } from './commands/send-invitation/send-invitation-by-id/send-invitation-by-id.handler';

const handlers: Provider[] = [
  UpdateCompanyHandler,
  GetCompanyHandler,
  GetCompanyListHandler,
  SendInvitationHandler,
  SendInvitationByIdHandler,
  AcceptInvitationHandler,
  GetMyLogoUploadUrlHandler,
  GetLogoUploadUrlHandler,
  GetSponsorCompanyListHandler,
  GetMyCompanyHandler,
  GetCustomerPortalHandler,
  GetCreditBalanceHandler,
  GetCreditTransactionListHandler,
  GetUnclaimedCompanyListHandler,
];

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueType.EMAIL }),
    StripeModule,
    StorageModule,
  ],
  providers: [...handlers],
  controllers: [CompanyController],
})
export class CompanyModule {}
