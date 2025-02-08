import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCompanyCommand } from './update-company.command';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { EntityManager } from '@mikro-orm/postgresql';
import { CompanySize } from '../../../../domain/company/entities/company-size.entity';
import { Company } from '../../../../domain/company/entities/company.entity';
import { CompanyError } from '../../company.error';
import { CompanyNotFoundException } from '../../../../domain/company/exceptions/company-not-found.exception';
import slugify from 'slugify';
import { SessionResponseDto } from '../../../auth/dtos/session-response.dto';

@CommandHandler(UpdateCompanyCommand)
export class UpdateCompanyHandler
  implements ICommandHandler<UpdateCompanyCommand>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: UpdateCompanyCommand,
  ): Promise<Result<SessionResponseDto, ResultError>> {
    const { user, dto } = command;

    if (!user.profile.id) {
      return Result.failure(CompanyError.ProfileNotFound);
    }

    const company = await this.em.findOne(Company, {
      id: user.profile.id,
    });

    if (!company) {
      throw new CompanyNotFoundException(user.profile.id);
    }

    company.name = dto.name;
    company.slug = slugify(dto.name, { lower: true });
    company.summary = dto.summary;
    company.description = dto.description;
    company.logoUrl = dto.logoUrl;
    company.websiteUrl = dto.websiteUrl;
    company.location = dto.location;
    company.size = this.em.getReference(CompanySize, dto.sizeId);
    company.socialLinks = dto.socialLinks || {};

    await this.em.flush();

    const response = new SessionResponseDto({
      ...user,
      profile: {
        id: company.id,
        name: company.name,
        avatarUrl: company.logoUrl,
      },
    });
    return Result.success(response);
  }
}
