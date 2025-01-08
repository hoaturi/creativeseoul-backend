import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { UpdateCompanyHandler } from './commands/update-company/update-company.handler';
import { GetCompanyListHandler } from './queries/get-company-list/get-company-list.handler';
import { SendInvitationHandler } from './commands/send-invitation/send-invitation.handler';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from '../../infrastructure/queue/queue-type.enum';
import { AcceptInvitationHandler } from './commands/accept-invitation/accept-invitation.handler';
import { PaddleModule } from '../../infrastructure/services/paddle/paddle.module';

@Module({
  imports: [BullModule.registerQueue({ name: QueueType.EMAIL }), PaddleModule],
  providers: [
    UpdateCompanyHandler,
    GetCompanyListHandler,
    SendInvitationHandler,
    AcceptInvitationHandler,
  ],
  controllers: [CompanyController],
})
export class CompanyModule {}
