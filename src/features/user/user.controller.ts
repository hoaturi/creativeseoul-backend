import {
  Body,
  Controller,
  HttpException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ChangePasswordRequestDto } from './dtos/change-password-request.dto';
import { ChangePasswordCommand } from './commands/change-password/change-password.command';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../infrastructure/security/authenticated-user.interface';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserError } from './user.error';
import { SessionGuard } from '../../infrastructure/security/guards/session.guard';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';

@UseGuards(SessionGuard)
@ApiUnauthorizedResponse({ example: AuthError.Unauthenticated })
@Controller('user')
export class UserController {
  public constructor(private readonly commandBus: CommandBus) {}

  @Patch('change-password')
  @ApiOkResponse()
  @ApiBadRequestResponse({
    examples: {
      ValidationFailed: {
        summary: 'Validation failed',
        value: CommonError.ValidationFailed,
      },
      CurrentPasswordIncorrect: {
        summary: 'Current password is incorrect',
        value: UserError.CurrentPasswordMismatch,
      },
    },
  })
  public async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordRequestDto,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new ChangePasswordCommand(user.id, {
        currentPassword: dto.currentPassword,
        newPassword: dto.newPassword,
      }),
    );

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
