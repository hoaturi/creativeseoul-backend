import {
  Body,
  Controller,
  Get,
  HttpException,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
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
import { GetCurrentUserResponseDto } from './dtos/get-current-user-response.dto';
import { GetCurrentUserQuery } from './query/get-current-user/get-current-user.query';
import { Request, Response } from 'express';

@UseGuards(AuthGuard)
@ApiUnauthorizedResponse({ example: AuthError.Unauthenticated })
@Controller('user')
export class UserController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBUs: QueryBus,
  ) {}

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
    @Req() req: Request,
    @Res({
      passthrough: true,
    })
    res: Response,
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

    await new Promise<void>((resolve): void => {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        resolve();
      });
    });

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

  @Get('current')
  @ApiOkResponse({
    type: GetCurrentUserResponseDto,
  })
  public async getCurrentUser(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetCurrentUserResponseDto> {
    const result = await this.queryBUs.execute(
      new GetCurrentUserQuery(user.id),
    );

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
