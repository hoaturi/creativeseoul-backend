import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUnclaimedCompanyListQuery } from './get-unclaimed-company-list.query';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import {
  GetUnclaimedCompanyListItemDto,
  GetUnclaimedCompanyListResponseDto,
} from '../../dtos/responses/get-unclaimed-company-list-response.dto';
import { Company } from '../../../../domain/company/entities/company.entity';

@QueryHandler(GetUnclaimedCompanyListQuery)
export class GetUnclaimedCompanyListHandler
  implements IQueryHandler<GetUnclaimedCompanyListQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    _: GetUnclaimedCompanyListQuery,
  ): Promise<Result<GetUnclaimedCompanyListResponseDto, ResultError>> {
    const companies = await this.em.find(
      Company,
      { isClaimed: false },
      {
        fields: ['id', 'name', 'websiteUrl', 'logoUrl'],
      },
    );

    const companyListItemDtos = companies.map(
      ({ id, name, websiteUrl, logoUrl }) =>
        new GetUnclaimedCompanyListItemDto({ id, name, websiteUrl, logoUrl }),
    );

    return Result.success(
      new GetUnclaimedCompanyListResponseDto(companyListItemDtos),
    );
  }
}
