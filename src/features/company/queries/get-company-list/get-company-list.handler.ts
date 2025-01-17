import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCompanyListQuery } from './get-company-list.query';
import {
  CompanyListItemDto,
  GetCompanyListResponseDto,
} from '../../dtos/responses/get-company-list-response.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Company } from '../../../../domain/company/entities/company.entity';

const COMPANY_FIELDS = [
  'id',
  'name',
  'summary',
  'logoUrl',
  'totalJobs',
] as const;

@QueryHandler(GetCompanyListQuery)
export class GetCompanyListHandler
  implements IQueryHandler<GetCompanyListQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetCompanyListQuery,
  ): Promise<Result<GetCompanyListResponseDto, ResultError>> {
    const { page = 1 } = query.dto;

    const [companies, count] = await this.em.findAndCount(
      Company,
      {},
      {
        fields: COMPANY_FIELDS,
        limit: 20,
        offset: (page - 1) * 20,
      },
    );

    const companyDtos = companies.map(
      (company) =>
        new CompanyListItemDto({
          id: company.id,
          name: company.name,
          summary: company.summary!,
          logoUrl: company.logoUrl,
          totalJobs: company.totalJobs,
        }),
    );

    return Result.success(new GetCompanyListResponseDto(companyDtos, count));
  }
}
