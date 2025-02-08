import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMyCompanyQuery } from './get-my-company.query';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { GetMyCompanyResponseDto } from '../../dtos/responses/get-my-company-response.dto';
import { Company } from '../../../../domain/company/entities/company.entity';
import { CompanyError } from '../../company.error';

@QueryHandler(GetMyCompanyQuery)
export class GetMyCompanyHandler implements IQueryHandler<GetMyCompanyQuery> {
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetMyCompanyQuery,
  ): Promise<Result<GetMyCompanyResponseDto, ResultError>> {
    const company = await this.em.findOne(
      Company,
      {
        id: query.user.profile.id,
      },
      {
        fields: [
          'slug',
          'name',
          'summary',
          'description',
          'logoUrl',
          'websiteUrl',
          'location',
          'size.id',
          'socialLinks',
        ],
      },
    );

    if (!company) {
      return Result.failure(CompanyError.ProfileNotFound);
    }

    const response = new GetMyCompanyResponseDto({
      slug: company.slug,
      name: company.name,
      summary: company.summary,
      description: company.description,
      logoUrl: company.logoUrl,
      websiteUrl: company.websiteUrl,
      location: company.location,
      sizeId: company.size.id,
      socialLinks: company.socialLinks,
    });

    return Result.success(response);
  }
}
