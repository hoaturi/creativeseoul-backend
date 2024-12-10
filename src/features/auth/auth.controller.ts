import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Patch,
  Post,
  Session,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ForgotPasswordRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  ResetPasswordRequestDto,
  SignUpRequestDto,
  VerifyEmailRequestDto,
} from './dtos';
import {
  ForgotPasswordCommand,
  LoginCommand,
  ResetPasswordCommand,
  SignUpCommand,
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

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly commandBus: CommandBus,
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {}

  @Post('sign-up')
  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    example: CommonError.ValidationFailed,
  })
  @ApiConflictResponse({
    example: AuthError.EmailAlreadyExists,
  })
  public async signUp(@Body() dto: SignUpRequestDto): Promise<void> {
    const result = await this.commandBus.execute(new SignUpCommand(dto));

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
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

    return result.value;
  }

  @Post('login')
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({ example: CommonError.ValidationFailed })
  @ApiUnauthorizedResponse({
    example: AuthError.InvalidCredentials,
  })
  public async login(
    @Body() dto: LoginRequestDto,
    @Session() session: Record<string, any>,
  ): Promise<void> {
    const result = await this.commandBus.execute(new LoginCommand(dto));

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    session.user = {
      id: result.value.user.id,
      role: result.value.user.role,
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiBadRequestResponse({ example: CommonError.ValidationFailed })
  @ApiNotFoundResponse({ example: UserError.UserNotFound })
  public async forgotPassword(
    @Body() dto: ForgotPasswordRequestDto,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new ForgotPasswordCommand(dto),
    );

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
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

    return result.value;
  }
}
