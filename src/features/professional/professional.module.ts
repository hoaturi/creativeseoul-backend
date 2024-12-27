import { Module } from '@nestjs/common';
import { ProfessionalController } from './professional.controller';
import { UpsertProfessionalHandler } from './commands/upsert-professional/upsert-professional.handler';
import { GetProfessionalHandler } from './queries/get-professional.handler';

@Module({
  controllers: [ProfessionalController],
  providers: [UpsertProfessionalHandler, GetProfessionalHandler],
})
export class ProfessionalModule {}
