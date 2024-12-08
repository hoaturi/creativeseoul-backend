import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { Result } from '../../../../common/result/result';
import { LoginResponseDto } from '../../dtos/login-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../../../../domain/user/user.entity';
import { AuthError } from '../../auth.error';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Inject, Logger } from '@nestjs/common';
import { applicationConfig } from '../../../../config/application.config';
import { ConfigType } from '@nestjs/config';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  private readonly logger = new Logger(LoginHandler.name);
  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {}

  async execute(
    command: LoginCommand,
  ): Promise<Result<LoginResponseDto, ResultError>> {
    const { email, password } = command.dto;

    const user = await this.em.findOne(User, { email });

    if (!user) {
      return Result.failure(AuthError.InvalidCredentials);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.log(
        { userId: user.id },
        'auth.login.failed: Invalid password',
      );
      return Result.failure(AuthError.InvalidCredentials);
    }

    if (!user.isVerified) {
      return Result.failure(AuthError.EmailNotVerified);
    }

    const accessToken = this.jwtService.sign(
      { userId: user.id, role: user.role },
      {
        secret: this.appConfig.jwt.accessSecret,
        expiresIn: `${this.appConfig.jwt.accessExpirationInMs}ms`,
      },
    );

    const refreshToken = this.jwtService.sign(
      { userId: user.id, role: user.role },
      {
        secret: this.appConfig.jwt.refreshSecret,
        expiresIn: `${this.appConfig.jwt.refreshExpirationInMs}ms`,
      },
    );

    this.logger.log(
      { userId: user.id },
      'auth.login.success: User authenticated',
    );
    return Result.success(
      new LoginResponseDto(accessToken, refreshToken, {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      }),
    );
  }
}
