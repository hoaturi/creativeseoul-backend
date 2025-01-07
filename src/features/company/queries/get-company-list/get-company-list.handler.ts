import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCompanyListQuery } from './get-company-list.query';
import {
  CompanyListItemDto,
  GetCompanyListResponseDto,
} from '../../dtos/get-company-list-response.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Company } from '../../../../domain/company/company.entity';

const COMPANY_FIELDS = [
  'id',
  'name',
  'summary',
  'logoUrl',
  'jobCount',
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
        new CompanyListItemDto(
          company.id,
          company.name,
          company.summary,
          company.logoUrl,
          company.jobCount,
        ),
    );

    return Result.success(new GetCompanyListResponseDto(companyDtos, count));
  }
}
