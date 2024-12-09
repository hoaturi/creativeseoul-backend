import {
  Body,
  Controller,
  HttpException,
  Inject,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ForgotPasswordRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  SignUpRequestDto,
  VerifyEmailRequestDto,
} from './dtos';
import {
  ForgotPasswordCommand,
  LoginCommand,
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
import { Response } from 'express';
import { applicationConfig } from '../../config/application.config';
import { ConfigType } from '@nestjs/config';
import { AuthApiErrorResponses } from './swagger/auth-api-error.responses';
import { combineExamples } from '../common/swagger/combine-examples.util';
import { CommonApiErrorResponses } from '../common/swagger/common-api-error.responses';
import { UserApiErrorResponses } from '../user/swagger/user-api-error.responses';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly commandBus: CommandBus,
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {}

  @Post('sign-up')
  @ApiCreatedResponse()
  @ApiBadRequestResponse(CommonApiErrorResponses.ValidationError)
  @ApiConflictResponse(AuthApiErrorResponses.EmailAlreadyExists)
  public async signUp(@Body() dto: SignUpRequestDto): Promise<void> {
    const result = await this.commandBus.execute(new SignUpCommand(dto));

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Patch('verify-email')
  @ApiOkResponse()
  @ApiBadRequestResponse(
    combineExamples(
      CommonApiErrorResponses.ValidationError,
      AuthApiErrorResponses.InvalidToken,
    ),
  )
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
  @ApiBadRequestResponse(CommonApiErrorResponses.ValidationError)
  @ApiUnauthorizedResponse(AuthApiErrorResponses.InvalidCredentials)
  public async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const result = await this.commandBus.execute(new LoginCommand(dto));

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    res.cookie('refreshToken', result.value.tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: this.appConfig.jwt.refreshExpirationInMs,
    });

    return new LoginResponseDto(
      result.value.tokens.accessToken,
      result.value.user,
    );
  }

  @Post('forgot-password')
  @ApiOkResponse()
  @ApiBadRequestResponse(CommonApiErrorResponses.ValidationError)
  @ApiNotFoundResponse(UserApiErrorResponses.UserNotFound)
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
}
