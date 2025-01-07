import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CreateCompanyHandler } from './commands/create-company/create-company.handler';

@Module({
  providers: [CreateCompanyHandler],
  controllers: [CompanyController],
})
export class CompanyModule {}
