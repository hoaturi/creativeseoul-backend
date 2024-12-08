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
import { SignUpRequestDto } from './dtos/sign-up-request.dto';
import { SignUpCommand } from './commands/signUp/sign-up.command';
import { ApiResponse } from '@nestjs/swagger';
import { VerifyEmailRequestDto } from './dtos/verify-email-request.dto';
import { VerifyEmailCommand } from './commands/verifyEmail/verify-email.command';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginCommand } from './commands/login/login.command';
import { Response } from 'express';
import { applicationConfig } from '../../config/application.config';
import { ConfigType } from '@nestjs/config';
import { LoginResponse } from './interfaces/login-response.interface';

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
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) rse: Response,
  ): Promise<LoginResponse> {
    const result = await this.commandBus.execute(new LoginCommand(dto));

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    rse.cookie('refreshToken', result.value.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: this.appConfig.jwt.refreshExpirationInMs,
    });

    return {
      accessToken: result.value.accessToken,
      user: result.value.user,
    };
  }
}
