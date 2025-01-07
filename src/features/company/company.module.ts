import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CreateCompanyHandler } from './commands/create-company/create-company.handler';
import { GetCompanyListHandler } from './queries/get-company-list/get-company-list.handler';

@Module({
  providers: [CreateCompanyHandler, GetCompanyListHandler],
  controllers: [CompanyController],
})
export class CompanyModule {}
