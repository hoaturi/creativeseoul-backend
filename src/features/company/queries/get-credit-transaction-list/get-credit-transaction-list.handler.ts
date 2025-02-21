import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCreditTransactionListQuery } from './get-credit-transaction-list.query';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import {
  GetCreditTransactionListItemDto,
  GetCreditTransactionListResponseDto,
} from '../../dtos/responses/get-credit-transaction-list-response.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { CreditTransaction } from '../../../../domain/company/entities/credit-transaction.entity';

@QueryHandler(GetCreditTransactionListQuery)
export class GetCreditTransactionListHandler
  implements IQueryHandler<GetCreditTransactionListQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetCreditTransactionListQuery,
  ): Promise<Result<GetCreditTransactionListResponseDto, ResultError>> {
    const { user } = query;

    const transactions = await this.em.find(
      CreditTransaction,
      {
        company: user.profile.id,
      },
      {
        fields: [
          'displayId',
          'type',
          'amount',
          'createdAt',
          'job.title',
          'job.slug',
        ],
        orderBy: { createdAt: 'DESC' },
      },
    );

    const response = transactions.map((transaction) => {
      return new GetCreditTransactionListItemDto({
        displayId: transaction.displayId,
        type: transaction.type,
        amount: transaction.amount,
        createdAt: transaction.createdAt,
        jobTitle: transaction.job?.title,
        jobSlug: transaction.job?.slug,
      });
    });

    return Result.success(new GetCreditTransactionListResponseDto(response));
  }
}
