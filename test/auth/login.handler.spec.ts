import { EntityManager } from '@mikro-orm/postgresql';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { applicationConfig } from '../../src/config/application.config';
import * as bcrypt from 'bcrypt';
import { AuthenticatedUserDto } from '../../src/features/auth/dtos/authenticated-user.dto';
import { User } from '../../src/domain/user/user.entity';
import { AuthError } from '../../src/features/auth/auth.error';
import { LoginHandler } from '../../src/features/auth/commands/login/login.handler';
import { LoginCommand } from '../../src/features/auth/commands/login/login.command';

jest.mock('bcrypt');

describe('LoginHandler', () => {
  let handler: LoginHandler;
  let jwtService: jest.Mocked<JwtService>;
  let em: jest.Mocked<EntityManager>;

  const mockEntityManger = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockAppConfig = {
    jwt: {
      accessSecret: 'test-access-secret',
      refreshSecret: 'test-refresh-secret',
      accessExpirationInMs: 3600000,
      refreshExpirationInMs: 86400000,
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LoginHandler,
        {
          provide: EntityManager,
          useValue: mockEntityManger,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: applicationConfig.KEY,
          useValue: mockAppConfig,
        },
      ],
    }).compile();

    handler = module.get<LoginHandler>(LoginHandler);
    em = module.get(EntityManager);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockEmail = 'test@example.com';
  const mockPassword = 'password123';
  const mockUser = {
    id: '1',
    email: mockEmail,
    password: mockPassword,
    role: 'CANDIDATE',
    isVerified: true,
  };

  it('should authenticate user and generate JWT tokens', async () => {
    em.findOne.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('token');

    const mockCommand = new LoginCommand({
      email: mockEmail,
      password: mockPassword,
    });

    const result = await handler.execute(mockCommand);

    expect(result.isSuccess).toBe(true);
    expect(em.findOne).toHaveBeenCalledWith(User, { email: mockEmail });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockPassword,
      mockUser.password,
    );
    expect(jwtService.sign).toHaveBeenCalledTimes(2);

    if (result.isSuccess) {
      expect(result.value.tokens.accessToken).toBe('token');
      expect(result.value.tokens.refreshToken).toBe('token');
      expect(result.value.user).toBeInstanceOf(AuthenticatedUserDto);
    }
  });

  it('should fail when user is not found', async () => {
    em.findOne.mockResolvedValue(null);

    const mockCommand = new LoginCommand({
      email: mockEmail,
      password: mockPassword,
    });

    const result = await handler.execute(mockCommand);

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBe(AuthError.InvalidCredentials);
    expect(em.findOne).toHaveBeenCalledWith(User, { email: mockEmail });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('should fail when password is invalid', async () => {
    em.findOne.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const mockCommand = new LoginCommand({
      email: mockEmail,
      password: 'wrongPassword',
    });

    const result = await handler.execute(mockCommand);

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBe(AuthError.InvalidCredentials);
    expect(em.findOne).toHaveBeenCalledWith(User, { email: mockEmail });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'wrongPassword',
      mockUser.password,
    );
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('should fail when user email is not verified', async () => {
    const unverifiedUser = { ...mockUser, isVerified: false };
    em.findOne.mockResolvedValue(unverifiedUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const mockCommand = new LoginCommand({
      email: mockEmail,
      password: mockPassword,
    });

    const result = await handler.execute(mockCommand);

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBe(AuthError.EmailNotVerified);
    expect(em.findOne).toHaveBeenCalledWith(User, { email: mockEmail });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockPassword,
      unverifiedUser.password,
    );
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('should generate correct JWT payloads', async () => {
    em.findOne.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('token');

    const mockCommand = new LoginCommand({
      email: mockEmail,
      password: mockPassword,
    });

    await handler.execute(mockCommand);

    // Verify access token payload
    expect(jwtService.sign).toHaveBeenCalledWith(
      {
        userId: mockUser.id,
        role: mockUser.role,
      },
      {
        secret: mockAppConfig.jwt.accessSecret,
        expiresIn: `${mockAppConfig.jwt.accessExpirationInMs}ms`,
      },
    );

    // Verify refresh token payload
    expect(jwtService.sign).toHaveBeenCalledWith(
      {
        userId: mockUser.id,
      },
      {
        secret: mockAppConfig.jwt.refreshSecret,
        expiresIn: `${mockAppConfig.jwt.refreshExpirationInMs}ms`,
      },
    );
  });
});
