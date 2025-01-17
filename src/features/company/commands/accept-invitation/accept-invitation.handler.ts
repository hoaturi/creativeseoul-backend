import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcceptInvitationCommand } from './accept-invitation.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { CompanyInvitation } from '../../../../domain/company/entities/company-invitation.entity';
import { CompanyError } from '../../company.error';
import { User } from '../../../../domain/user/user.entity';
import { AuthError } from '../../../auth/auth.error';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../../../domain/user/user-role.enum';
import { Logger } from '@nestjs/common';
import { StripeService } from '../../../../infrastructure/services/stripe/stripe.service';

const INVITATION_FIELDS = [
  'id',
  'isAccepted',
  'company.id',
  'company.name',
  'company.isClaimed',
  'company.customerId',
  'company.user.id',
] as const;

@CommandHandler(AcceptInvitationCommand)
export class AcceptInvitationHandler
  implements ICommandHandler<AcceptInvitationCommand>
{
  private readonly logger = new Logger(AcceptInvitationHandler.name);

  public constructor(
    private readonly em: EntityManager,
    private readonly stripeService: StripeService,
  ) {}

  public async execute(
    command: AcceptInvitationCommand,
  ): Promise<Result<void, ResultError>> {
    const { token, email, password } = command.dto;

    const invitation = await this.em.findOne(
      CompanyInvitation,
      {
        token: token,
        expiresAt: { $gte: new Date() },
        isAccepted: false,
      },
      {
        fields: INVITATION_FIELDS,
      },
    );

    if (!invitation) {
      return Result.failure(CompanyError.InvalidInvitationToken);
    }

    if (invitation.company.isClaimed) {
      return Result.failure(CompanyError.ProfileAlreadyClaimed);
    }

    const emailExists = await this.em.findOne(
      User,
      { email },
      { fields: ['id'] },
    );

    if (emailExists) {
      return Result.failure(AuthError.EmailAlreadyExists);
    }

    invitation.company.user = await this.createCompanyUser(email, password);
    invitation.isAccepted = true;
    invitation.company.isClaimed = true;

    const customer = await this.stripeService.createCustomer(
      invitation.company.name,
      email,
    );
    invitation.company.customerId = customer.id;

    await this.em.flush();

    await this.em.nativeDelete(CompanyInvitation, {
      company: invitation.company.id,
      isAccepted: false,
    });

    this.logger.log(
      { userId: invitation.company.user.id, companyId: invitation.company.id },
      'company.accept-invitation.success: User accepted company invitation successfully',
    );

    return Result.success();
  }

  private async createCompanyUser(
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.em.create(
      User,
      new User(email, hashedPassword, UserRole.COMPANY),
    );
    user.isVerified = true;
    return user;
  }
}
