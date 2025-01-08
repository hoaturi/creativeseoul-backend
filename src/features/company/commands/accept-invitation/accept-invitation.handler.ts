import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcceptInvitationCommand } from './accept-invitation.command';
import { EntityManager, Loaded } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { CompanyInvitation } from '../../../../domain/company/company-invitation.entity';
import { CompanyError } from '../../company.error';
import { User } from '../../../../domain/user/user.entity';
import { AuthError } from '../../../auth/auth.error';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../../../domain/user/user-role.enum';
import { Logger } from '@nestjs/common';
import { PaymentService } from '../../../../infrastructure/services/payment/payment.service';

const INVITATION_FIELDS = [
  'id',
  'isAccepted',
  'company.id',
  'company.name',
  'company.paymentCustomerId',
  'company.isClaimed',
  'company.user.id',
] as const;

type InvitationFields = (typeof INVITATION_FIELDS)[number];
type LoadedInvitation = Loaded<CompanyInvitation, never, InvitationFields>;

@CommandHandler(AcceptInvitationCommand)
export class AcceptInvitationHandler
  implements ICommandHandler<AcceptInvitationCommand>
{
  private readonly logger = new Logger(AcceptInvitationHandler.name);

  public constructor(
    private readonly em: EntityManager,
    private readonly paymentService: PaymentService,
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

    await this.setupPaymentCustomer(invitation, email);

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

  private async setupPaymentCustomer(
    invitation: LoadedInvitation,
    email: string,
  ): Promise<void> {
    const customer = await this.paymentService.createCustomer(
      invitation.company.name,
      email,
      invitation.company.id,
    );
    invitation.company.paymentCustomerId = customer.id;
  }
}
