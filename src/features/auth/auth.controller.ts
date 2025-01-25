import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Patch,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ForgotPasswordRequestDto,
  LoginRequestDto,
  ResetPasswordRequestDto,
  SignUpRequestDto,
  VerifyEmailRequestDto,
} from './dtos';
import {
  ForgotPasswordCommand,
  LoginCommand,
  ResetPasswordCommand,
  SignupCommand,
  VerifyEmailCommand,
} from './commands';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applicationConfig } from '../../config/application.config';
import { ConfigType } from '@nestjs/config';
import { CommonError } from '../common/common.error';
import { AuthError } from './auth.error';
import { UserError } from '../user/user.error';
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
import { Request, Response } from 'express';
import { SessionResponseDto } from './dtos/session-response.dto';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../infrastructure/security/authenticated-user.interface';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly commandBus: CommandBus,
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {}

  @Post('signup')
  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    example: CommonError.ValidationFailed,
  })
  @ApiConflictResponse({
    example: AuthError.EmailAlreadyExists,
  })
  public async signUp(@Body() dto: SignUpRequestDto): Promise<void> {
    const result = await this.commandBus.execute(new SignupCommand(dto));

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
  }

  @Patch('verify-email')
  @ApiOkResponse()
  @ApiBadRequestResponse({
    examples: {
      ValidationFailed: {
        summary: 'Validation failed',
        value: CommonError.ValidationFailed,
      },
      InvalidToken: {
        summary: 'Invalid token',
        value: AuthError.InvalidToken,
      },
    },
  })
  public async verifyEmail(@Body() dto: VerifyEmailRequestDto): Promise<void> {
    const result = await this.commandBus.execute(new VerifyEmailCommand(dto));

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: SessionResponseDto,
  })
  @ApiBadRequestResponse({ example: CommonError.ValidationFailed })
  @ApiUnauthorizedResponse({
    example: AuthError.InvalidCredentials,
  })
  public async login(
    @Body() dto: LoginRequestDto,
    @Session() session: Record<string, any>,
  ): Promise<SessionResponseDto> {
    const result = await this.commandBus.execute(new LoginCommand(dto));

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    session.user = result.value.user;
    return result.value;
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  public async logout(
    @Req() req: Request,
    @Res({
      passthrough: true,
    })
    res: Response,
  ): Promise<void> {
    await new Promise<void>((resolve): void => {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        resolve();
      });
    });
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiBadRequestResponse({ example: CommonError.ValidationFailed })
  @ApiNotFoundResponse({ example: UserError.NotFound })
  public async forgotPassword(
    @Body() dto: ForgotPasswordRequestDto,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new ForgotPasswordCommand(dto),
    );

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
  }

  @Patch('reset-password')
  @ApiOkResponse()
  @ApiBadRequestResponse({
    examples: {
      ValidationFailed: {
        summary: 'Validation failed',
        value: CommonError.ValidationFailed,
      },
      InvalidToken: {
        summary: 'Invalid token',
        value: AuthError.InvalidToken,
      },
    },
  })
  public async resetPassword(
    @Body() dto: ResetPasswordRequestDto,
  ): Promise<void> {
    const result = await this.commandBus.execute(new ResetPasswordCommand(dto));

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
  }

  @Get('session')
  @ApiOkResponse({
    type: SessionResponseDto || undefined,
  })
  public getCurrentUser(
    @CurrentUser() user: AuthenticatedUser,
  ): SessionResponseDto | undefined {
    if (!user) {
      return undefined;
    }

    return new SessionResponseDto(user);
  }
}
