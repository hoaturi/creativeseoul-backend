import { Test } from '@nestjs/testing';
import {
  ResetPasswordCommand,
  ResetPasswordHandler,
} from '../../src/features/auth/commands';
import { EntityManager } from '@mikro-orm/postgresql';
import { ForgotPasswordToken } from '../../src/domain/auth/forgot-password-token.entity';
import { AuthError } from '../../src/features/auth/auth.error';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('ResetPasswordHandler', () => {
  let handler: ResetPasswordHandler;
  let em: jest.Mocked<EntityManager>;

  const mockCommand = new ResetPasswordCommand({
    token: 'valid-token',
    password: 'new-password',
    confirmPassword: 'new-password',
  });

  beforeEach(async () => {
    em = {
      findOne: jest.fn(),
      flush: jest.fn(),
      nativeDelete: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        ResetPasswordHandler,
        {
          provide: EntityManager,
          useValue: em,
        },
      ],
    }).compile();

    handler = module.get<ResetPasswordHandler>(ResetPasswordHandler);
    em = module.get(EntityManager);

    jest.clearAllMocks();

    (bcrypt.hash as jest.Mock).mockResolvedValue('new-hash');
  });

  it('should successfully reset password with valid token', async () => {
    const mockUser = { id: '123', password: 'old-hash' };
    const mockToken = {
      id: '456',
      token: 'valid-token',
      user: mockUser,
      usedAt: null,
      expiresAt: new Date(Date.now() + 3600000),
    };

    em.findOne.mockResolvedValue(mockToken);

    const result = await handler.execute(mockCommand);

    expect(result.isSuccess).toBe(true);
    expect(mockUser.password).toBe('new-hash');
    expect(mockToken.usedAt).toBeInstanceOf(Date);
    expect(em.flush).toHaveBeenCalled();
    expect(em.nativeDelete).toHaveBeenCalledWith(ForgotPasswordToken, {
      id: { $ne: '456' },
      user: '123',
    });
  });

  it('should fail when the token is invalid, expired, or already used', async () => {
    em.findOne.mockResolvedValue(null);

    const result = await handler.execute(mockCommand);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(AuthError.InvalidToken);
    expect(em.flush).not.toHaveBeenCalled();
    expect(em.nativeDelete).not.toHaveBeenCalled();
  });
});
