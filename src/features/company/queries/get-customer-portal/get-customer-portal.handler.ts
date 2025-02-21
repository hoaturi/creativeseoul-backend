import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerPortalQuery } from './get-customer-portal.query';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { GetCustomerPortalResponseDto } from '../../dtos/responses/get-customer-portal-response.dto';
import { Company } from '../../../../domain/company/entities/company.entity';
import { CompanyNotFoundException } from '../../../../domain/company/exceptions/company-not-found.exception';
import { StripeService } from '../../../../infrastructure/services/stripe/stripe.service';

@QueryHandler(GetCustomerPortalQuery)
export class GetCustomerPortalHandler
  implements IQueryHandler<GetCustomerPortalQuery>
{
  public constructor(
    private readonly em: EntityManager,
    private readonly stripeService: StripeService,
  ) {}

  public async execute(
    query: GetCustomerPortalQuery,
  ): Promise<Result<GetCustomerPortalResponseDto, ResultError>> {
    const { user } = query;

    const company = await this.em.findOne(
      Company,
      {
        id: user.profile.id,
      },
      {
        fields: ['customerId'],
      },
    );

    if (!company) {
      throw new CompanyNotFoundException(user.profile.id!);
    }

    const session = await this.stripeService.getCustomerPortal(
      company.customerId!,
    );

    return Result.success(new GetCustomerPortalResponseDto(session.url));
  }
}
