import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSponsorCompanyListQuery } from './get-sponsor-company-list.query';
import { EntityManager } from '@mikro-orm/postgresql';
import { Sponsorship } from '../../../../domain/company/entities/sponsorship.entity';
import {
  GetSponsorCompanyListItemDto,
  GetSponsorCompanyListResponseDto,
} from '../../dtos/responses/get-sponsor-company-list-response.dto';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';

@QueryHandler(GetSponsorCompanyListQuery)
export class GetSponsorCompanyListHandler
  implements IQueryHandler<GetSponsorCompanyListQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    _: GetSponsorCompanyListQuery,
  ): Promise<Result<GetSponsorCompanyListResponseDto, ResultError>> {
    const companies = await this.em.find(
      Sponsorship,
      {
        currentPeriodEnd: {
          $gte: new Date(),
        },
      },
      {
        fields: [
          'company.id',
          'company.name',
          'company.logoUrl',
          'company.websiteUrl',
        ],
      },
    );

    const companyListItemDtos = companies.map((company) => {
      return new GetSponsorCompanyListItemDto({
        id: company.company.id,
        name: company.company.name,
        logoUrl: company.company.logoUrl,
        websiteUrl: company.company.websiteUrl,
      });
    });

    return Result.success(
      new GetSponsorCompanyListResponseDto(companyListItemDtos),
    );
  }
}
