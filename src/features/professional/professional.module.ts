import { Module } from '@nestjs/common';
import { ProfessionalController } from './professional.controller';
import { UpsertProfessionalHandler } from './commands/upsert-professional/upsert-professional.handler';
import { GetProfessionalHandler } from './queries/get-professional/get-professional.handler';
import { GetProfessionalListHandler } from './queries/get-professional-list/get-professional-list.handler';

@Module({
  controllers: [ProfessionalController],
  providers: [
    UpsertProfessionalHandler,
    GetProfessionalHandler,
    GetProfessionalListHandler,
  ],
})
export class ProfessionalModule {}
