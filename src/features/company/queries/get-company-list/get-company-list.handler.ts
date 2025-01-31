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
  'slug',
  'name',
  'summary',
  'logoUrl',
  'totalJobs',
  'location',
  'size.label',
  'isSponsor',
] as const;

@QueryHandler(GetCompanyListQuery)
export class GetCompanyListHandler
  implements IQueryHandler<GetCompanyListQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    _: GetCompanyListQuery,
  ): Promise<Result<GetCompanyListResponseDto, ResultError>> {
    const companies = await this.em.find(
      Company,
      {},
      {
        fields: COMPANY_FIELDS,
      },
    );

    const companyDtos = companies.map(
      (company) =>
        new CompanyListItemDto({
          slug: company.slug,
          name: company.name,
          summary: company.summary!,
          logoUrl: company.logoUrl,
          location: company.location,
          size: company.size.label,
          isSponsor: company.isSponsor,
          totalJobs: company.totalJobs,
        }),
    );

    return Result.success(new GetCompanyListResponseDto(companyDtos));
  }
}
