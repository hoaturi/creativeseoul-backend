import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCreditBalanceQuery } from './get-credit-balance.query';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { EntityManager } from '@mikro-orm/postgresql';
import { Company } from '../../../../domain/company/entities/company.entity';
import { CompanyNotFoundException } from '../../../../domain/company/exceptions/company-not-found.exception';
import { GetCreditBalanceResponseDto } from '../../dtos/responses/get-credit-balance-response.dto';

@QueryHandler(GetCreditBalanceQuery)
export class GetCreditBalanceHandler
  implements IQueryHandler<GetCreditBalanceQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetCreditBalanceQuery,
  ): Promise<Result<GetCreditBalanceResponseDto, ResultError>> {
    const { user } = query;

    const company = await this.em.findOne(
      Company,
      {
        id: user.profile.id,
      },
      {
        fields: ['creditBalance'],
      },
    );

    if (!company) {
      throw new CompanyNotFoundException(user.profile.id!);
    }

    return Result.success(
      new GetCreditBalanceResponseDto(company.creditBalance),
    );
  }
}
