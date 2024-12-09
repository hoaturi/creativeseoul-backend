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
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { applicationConfig } from '../../config/application.config';
import { ConfigType } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {}

  @Post('signup')
  @ApiResponse({
    status: 201,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
  })
  async signUp(@Body() dto: SignUpRequestDto): Promise<void> {
    const result = await this.commandBus.execute(new SignUpCommand(dto));

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Patch('verify-email')
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token',
  })
  async verifyEmail(@Body() dto: VerifyEmailRequestDto): Promise<void> {
    const result = await this.commandBus.execute(new VerifyEmailCommand(dto));

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(
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
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async forgotPassword(@Body() dto: ForgotPasswordRequestDto): Promise<void> {
    const result = await this.commandBus.execute(
      new ForgotPasswordCommand(dto),
    );

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
