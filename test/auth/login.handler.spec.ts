import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { LoginCommand, LoginHandler } from '../../src/features/auth/commands';
import { LoginCommandResult } from '../../src/features/auth/commands/login/login-command.result';
import { AuthError } from '../../src/features/auth/auth.error';
import { UserRole } from '../../src/domain/user/user-role.enum';

jest.mock('bcrypt');

describe('LoginHandler', () => {
  let handler: LoginHandler;
  let em: jest.Mocked<EntityManager>;

  const mockEntityManager = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LoginHandler,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    handler = module.get<LoginHandler>(LoginHandler);
    em = module.get(EntityManager);

    jest.clearAllMocks();
  });

  const mockEmail = 'test@example.com';
  const mockPassword = 'password123';
  const mockUser = {
    id: '1',
    email: mockEmail,
    password: mockPassword,
    role: UserRole.TALENT,
    isVerified: true,
  };

  it('should return success with user data on successful login', async () => {
    em.findOne.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await handler.execute(
      new LoginCommand({
        email: mockEmail,
        password: mockPassword,
      }),
    );

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBeInstanceOf(LoginCommandResult);
    expect(result.value).toEqual({
      user: {
        id: mockUser.id,
        role: mockUser.role,
      },
    });
  });

  it('should fail with invalid credentials when user is not found', async () => {
    em.findOne.mockResolvedValue(null);

    const result = await handler.execute(
      new LoginCommand({
        email: mockEmail,
        password: mockPassword,
      }),
    );

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
});
