import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcceptInvitationCommand } from './accept-invitation.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { CompanyInvitation } from '../../../../domain/company/company-invitation.entity';
import { CompanyError } from '../../company.error';
import { User } from '../../../../domain/user/user.entity';
import { AuthError } from '../../../auth/auth.error';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../../../domain/user/user-role.enum';
import { Logger } from '@nestjs/common';

@CommandHandler(AcceptInvitationCommand)
export class AcceptInvitationHandler
  implements ICommandHandler<AcceptInvitationCommand>
{
  private readonly logger = new Logger(AcceptInvitationHandler.name);

  public constructor(private readonly em: EntityManager) {}

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
        fields: ['id', 'isAccepted', 'company.isClaimed', 'company.user.id'],
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.em.create(
      User,
      new User(email, hashedPassword, UserRole.COMPANY),
    );
    user.isVerified = true;

    invitation.isAccepted = true;
    invitation.company.user = user;
    invitation.company.isClaimed = true;

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
}
