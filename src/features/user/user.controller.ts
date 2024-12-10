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
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';
import { ChangeUsernameRequestDto } from './dtos/change-username-request.dto';
import { ChangeUsernameCommand } from './commands/change-username/change-username.command';

@UseGuards(AuthGuard)
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

  @Patch('change-username')
  @ApiOkResponse()
  @ApiBadRequestResponse({
    examples: {
      ValidationFailed: {
        summary: 'Validation failed',
        value: CommonError.ValidationFailed,
      },
    },
  })
  public async changeUsername(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangeUsernameRequestDto,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new ChangeUsernameCommand(user.id, dto.username),
    );

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
