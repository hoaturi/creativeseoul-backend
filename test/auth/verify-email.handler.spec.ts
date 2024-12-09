import { Test } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  VerifyEmailCommand,
  VerifyEmailHandler,
} from '../../src/features/auth/commands';
import { User } from '../../src/domain/user/user.entity';
import { AuthError } from '../../src/features/auth/auth.error';
import { EmailVerificationToken } from '../../src/domain/auth/email-verification-token.entity';

describe('VerifyEmailHandler', () => {
  let handler: VerifyEmailHandler;
  let em: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    em = {
      findOne: jest.fn(),
      flush: jest.fn(),
      nativeDelete: jest.fn(),
    } as any;

    const moduleRef = await Test.createTestingModule({
      providers: [
        VerifyEmailHandler,
        {
          provide: EntityManager,
          useValue: em,
        },
      ],
    }).compile();

    handler = moduleRef.get<VerifyEmailHandler>(VerifyEmailHandler);
  });

  it('should successfully verify email when token is valid', async () => {
    // Arrange
    const mockUser = {
      id: 'user-id',
      isVerified: false,
    };

    const mockVerification = {
      id: 'token-id',
      token: 'valid-token',
      usedAt: null,
      expiresAt: new Date(Date.now() + 1000),
      user: mockUser,
    };

    em.findOne.mockResolvedValue(mockVerification);

    // Act
    const result = await handler.execute(
      new VerifyEmailCommand({ token: 'valid-token' }),
    );

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(mockVerification.usedAt).toBeDefined();
    expect(mockUser.isVerified).toBe(true);
    expect(em.flush).toHaveBeenCalled();
    expect(em.nativeDelete).toHaveBeenCalledWith(EmailVerificationToken, {
      id: { $ne: mockVerification.id },
      user: mockUser.id,
    });
  });

  it('should return failure when token is not found', async () => {
    // Arrange
    em.findOne.mockResolvedValue(null);

    // Act
    const result = await handler.execute(
      new VerifyEmailCommand({ token: 'invalid-token' }),
    );

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(AuthError.InvalidToken);
    expect(em.flush).not.toHaveBeenCalled();
    expect(em.nativeDelete).not.toHaveBeenCalled();
  });

  it('should return failure when token is expired', async () => {
    // Arrange
    jest.useFakeTimers();
    const now = new Date('2024-01-01T00:00:00Z');
    jest.setSystemTime(now);

    em.findOne.mockResolvedValue(null);

    // Act
    const result = await handler.execute(
      new VerifyEmailCommand({ token: 'expired-token' }),
    );

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(AuthError.InvalidToken);
    expect(em.flush).not.toHaveBeenCalled();
    expect(em.nativeDelete).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('should return failure when user is already verified', async () => {
    // Arrange
    const mockUser = {
      id: 'user-id',
      isVerified: true,
    } as User;

    const mockVerification = {
      token: 'valid-token',
      usedAt: null,
      expiresAt: new Date(Date.now() + 1000),
      user: mockUser,
    } as EmailVerificationToken;

    em.findOne.mockResolvedValue(mockVerification);

    // Act
    const result = await handler.execute(
      new VerifyEmailCommand({ token: 'valid-token' }),
    );

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe(AuthError.InvalidToken);
    expect(em.flush).not.toHaveBeenCalled();
    expect(em.nativeDelete).not.toHaveBeenCalled();
  });
});
