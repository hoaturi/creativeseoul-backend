import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCompanyCommand } from './create-company.command';
import { CompanyError } from '../../company.error';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { EntityManager } from '@mikro-orm/postgresql';
import { CompanySize } from '../../../../domain/common/entities/company-size.entity';
import { Company } from '../../../../domain/company/company.entity';
import { User } from '../../../../domain/user/user.entity';

@CommandHandler(CreateCompanyCommand)
export class CreateCompanyHandler
  implements ICommandHandler<CreateCompanyCommand>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: CreateCompanyCommand,
  ): Promise<Result<void, ResultError>> {
    const { user, dto } = command;

    if (user.profileId) {
      return Result.failure(CompanyError.ProfileAlreadyExists);
    }

    const userRef = this.em.getReference(User, user.id);
    const companySize = this.em.getReference(CompanySize, dto.sizeId);

    const company = new Company({ ...dto, size: companySize }, userRef);

    this.em.create(Company, company);

    await this.em.flush();

    return Result.success();
  }
}
