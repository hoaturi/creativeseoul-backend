import { EntityManager } from '@mikro-orm/postgresql';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { applicationConfig } from '../../src/config/application.config';
import * as bcrypt from 'bcrypt';
import { AuthenticatedUserDto } from '../../src/features/auth/dtos/authenticated-user.dto';
import { AuthError } from '../../src/features/auth/auth.error';
import { LoginCommand, LoginHandler } from '../../src/features/auth/commands';
import { UserRole } from '../../src/domain/user/user.entity';

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
    username: 'test',
    email: mockEmail,
    password: mockPassword,
    role: UserRole.CANDIDATE,
    isVerified: true,
  };

  it('should return authenticated user with tokens on successful login', async () => {
    em.findOne.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('token');

    const result = await handler.execute(
      new LoginCommand({
        email: mockEmail,
        password: mockPassword,
      }),
    );

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.value).toEqual({
        tokens: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        },
        user: expect.any(AuthenticatedUserDto),
      });
    }
  });

  it('should fail with invalid credentials when user is not found', async () => {
    em.findOne.mockResolvedValue(null);

    const mockCommand = new LoginCommand({
      email: mockEmail,
      password: mockPassword,
    });

    const result = await handler.execute(mockCommand);

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBe(AuthError.InvalidCredentials);
  });

  it('should fail with invalid credentials when password is incorrect', async () => {
    em.findOne.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await handler.execute(
      new LoginCommand({
        email: mockEmail,
        password: 'wrongPassword',
      }),
    );

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBe(AuthError.InvalidCredentials);
  });

  it('should fail when user email is not verified', async () => {
    const unverifiedUser = { ...mockUser, isVerified: false };
    em.findOne.mockResolvedValue(unverifiedUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await handler.execute(
      new LoginCommand({
        email: mockEmail,
        password: mockPassword,
      }),
    );

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBe(AuthError.EmailNotVerified);
  });

  it('should return access and refresh tokens on successful login', async () => {
    em.findOne.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    const authenticatedUser = new AuthenticatedUserDto(mockUser);

    const result = await handler.execute(
      new LoginCommand({
        email: mockEmail,
        password: mockPassword,
      }),
    );

    expect(result.isSuccess).toBeTruthy();
    expect(result.value).toEqual({
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
      user: expect.objectContaining(authenticatedUser),
    });
  });
});
