import { Test } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';
import { VerifyEmailHandler } from '../../src/features/auth/commands/verifyEmail/verify-email.handler';
import { User } from '../../src/domain/user/user.entity';
import { EmailVerification } from '../../src/domain/auth/email-verification.entity';
import { VerifyEmailCommand } from '../../src/features/auth/commands/verifyEmail/verify-email.command';
import { AuthError } from '../../src/features/auth/auth.error';

describe('VerifyEmailHandler', () => {
  let handler: VerifyEmailHandler;
  let mockEntityManager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    mockEntityManager = {
      findOne: jest.fn(),
      flush: jest.fn(),
    } as any;

    const moduleRef = await Test.createTestingModule({
      providers: [
        VerifyEmailHandler,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    handler = moduleRef.get<VerifyEmailHandler>(VerifyEmailHandler);
  });

  it('should successfully verify email when token is valid', async () => {
    // Arrange
    const user = {
      isVerified: false,
    } as User;

    const verification = {
      token: 'valid-token',
      usedAt: null,
      expiresAt: new Date(Date.now() + 60 * 30 * 1000),
      user,
    } as EmailVerification;

    mockEntityManager.findOne.mockResolvedValue(verification);

    // Act
    const result = await handler.execute(
      new VerifyEmailCommand({ token: 'valid-token' }),
    );

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(mockEntityManager.findOne).toHaveBeenCalled();
    expect(verification.usedAt).toBeDefined();
    expect(verification.user.isVerified).toBe(true);
    expect(mockEntityManager.flush).toHaveBeenCalled();

    it('should fail when token is invalid', async () => {
      // Arrange
      mockEntityManager.findOne.mockResolvedValue(null);

      // Act
      const result = await handler.execute(
        new VerifyEmailCommand({ token: 'invalid-token' }),
      );

      // Assert
      expect(result.isSuccess).toBe(false);
      expect(result.error).toBe(AuthError.InvalidToken);
      expect(mockEntityManager.flush).not.toHaveBeenCalled();
    });

    it('should fail when user is already verified', async () => {
      // Arrange
      const user = {
        isVerified: true,
      } as User;

      const verification = {
        token: 'valid-token',
        usedAt: null,
        expiresAt: new Date(Date.now() + 60 * 30 * 1000),
        user,
      } as EmailVerification;

      mockEntityManager.findOne.mockResolvedValue(verification);

      // Act
      const result = await handler.execute(
        new VerifyEmailCommand({ token: 'valid-token' }),
      );

      // Assert
      expect(result.isSuccess).toBe(false);
      expect(result.error).toBe(AuthError.InvalidToken);
      expect(mockEntityManager.flush).not.toHaveBeenCalled();
    });
  });
});
