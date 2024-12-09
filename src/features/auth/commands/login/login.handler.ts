import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginCommand } from './login.command';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { User } from '../../../../domain/user/user.entity';
import { AuthError } from '../../auth.error';
import { applicationConfig } from '../../../../config/application.config';
import { ConfigType } from '@nestjs/config';
import { TokenPair } from './token-pair.interface';
import { JwtPayload } from '../../../../domain/auth/jwt-payload.interface';
import { LoginCommandResult } from './login-command.result';
import { AuthenticatedUserDto } from '../../dtos/authenticated-user.dto';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  private readonly logger = new Logger(LoginHandler.name);

  public constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
  ) {}

  public async execute(
    command: LoginCommand,
  ): Promise<Result<LoginCommandResult, ResultError>> {
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

    const tokens = this.generateTokens({
      userId: user.id,
      role: user.role,
    });

    this.logger.log(
      { userId: user.id },
      'auth.login.success: User authenticated',
    );

    const authenticatedUser = new AuthenticatedUserDto(user);
    return Result.success(new LoginCommandResult(tokens, authenticatedUser));
  }

  private generateTokens(payload: JwtPayload): TokenPair {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.appConfig.jwt.accessSecret,
      expiresIn: `${this.appConfig.jwt.accessExpirationInMs}ms`,
    });

    const refreshToken = this.jwtService.sign(
      {
        userId: payload.userId,
      },
      {
        secret: this.appConfig.jwt.refreshSecret,
        expiresIn: `${this.appConfig.jwt.refreshExpirationInMs}ms`,
      },
    );

    return { accessToken, refreshToken };
  }
}
