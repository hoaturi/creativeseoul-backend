import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { UpdateCompanyHandler } from './commands/update-company/update-company.handler';
import { GetCompanyListHandler } from './queries/get-company-list/get-company-list.handler';

@Module({
  providers: [UpdateCompanyHandler, GetCompanyListHandler],
  controllers: [CompanyController],
})
export class CompanyModule {}
