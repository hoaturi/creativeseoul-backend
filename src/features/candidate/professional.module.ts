import { Module } from '@nestjs/common';
import { ProfessionalController } from './professional.controller';
import { UpsertProfessionalHandler } from './commands/upsert-professional/upsert-professional.handler';

@Module({
  controllers: [ProfessionalController],
  providers: [UpsertProfessionalHandler],
})
export class ProfessionalModule {}
